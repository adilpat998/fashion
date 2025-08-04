const router = require('express').Router();
const { Clothes, ClothesImages } = require('../../db/models');
const adminRouter = require('./admin.js');

// Stripe setup
const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripe;
if (stripeSecret) {
  stripe = require('stripe')(stripeSecret);
}

// Create Stripe Checkout session for a clothing item
router.post('/checkout', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  const { name, price, imageUrl, id } = req.body;
  if (!name || !price || !id) return res.status(400).json({ error: 'Missing item info' });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name,
              images: imageUrl ? [imageUrl] : undefined,
            },
            unit_amount: Math.round(Number(price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:5173'}/success`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}/clothes/${id}`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const { requireAdmin } = require('./admin.js');
const { multipleMulterUpload, multiplePublicFileUpload, singleMulterUpload, singlePublicFileUpload, deleteS3File } = require('../../utils/awsS3');


router.use('/admin', adminRouter);


// Get all clothes with images and category
router.get('/clothes', async (req, res) => {
  const { categoryId } = req.query;
  const include = [
    { model: ClothesImages, as: 'images' },
    { association: 'category' }
  ];
  const where = categoryId ? { categoryId } : undefined;
  const clothes = await Clothes.findAll({
    where,
    include,
    order: [['createdAt', 'DESC']]
  });
  res.json(clothes);
});


// Get a single clothing item by id with images and category
router.get('/clothes/:id', async (req, res) => {
  const { id } = req.params;
  const item = await Clothes.findByPk(id, {
    include: [
      { model: ClothesImages, as: 'images' },
      { association: 'category' }
    ]
  });
  if (!item) return res.status(404).json({ error: 'Clothing item not found' });
  res.json(item);
});

// Add a new clothing item (admin only, supports single image upload)
router.post('/clothes', requireAdmin, singleMulterUpload('image'), async (req, res) => {
  const { name, description, sizes, price, categoryId } = req.body;
  let imageUrl = '';
  if (req.file) {
    imageUrl = await singlePublicFileUpload(req.file);
  }
  const newClothes = await Clothes.create({ name, description, sizes, price, imageUrl, categoryId });
  // Optionally, add the image to ClothesImages if uploaded
  if (imageUrl) {
    await ClothesImages.create({ clothesId: newClothes.id, imageUrl });
  }
  res.status(201).json(newClothes);
});

// Add images to a clothing item (admin only, supports multiple)
router.post('/clothes/:id/images', requireAdmin, multipleMulterUpload('images'), async (req, res) => {
  const { id } = req.params;
  // Upload files to S3 and get their URLs
  const imageUrls = await multiplePublicFileUpload(req.files);
  // Save S3 URLs in the database
  const files = imageUrls.map(url => ({ clothesId: id, imageUrl: url }));
  const images = await ClothesImages.bulkCreate(files);
  res.status(201).json(images);
});

// Edit/update a clothing item (admin only, supports image replacement and category change)
router.put('/clothes/:id', requireAdmin, singleMulterUpload('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, sizes, price, categoryId } = req.body;
  const clothing = await Clothes.findByPk(id);
  if (!clothing) return res.status(404).json({ error: 'Clothing item not found' });

  let imageUrl = clothing.imageUrl;
  if (req.file) {
    // If a new image is uploaded, upload to S3 and update
    imageUrl = await singlePublicFileUpload(req.file);
    // Optionally, add to ClothesImages
    await ClothesImages.create({ clothesId: clothing.id, imageUrl });
  }

  await clothing.update({ name, description, sizes, price, imageUrl, categoryId });
  res.json(clothing);
});

// Delete a clothing item (admin only)
router.delete('/clothes/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  // Find all images for this clothing item
  const images = await ClothesImages.findAll({ where: { clothesId: id } });
  // Delete each image from S3
  for (const img of images) {
    await deleteS3File(img.imageUrl);
  }
  // Delete the clothing item and its images from the database
  await Clothes.destroy({ where: { id } });
  res.json({ success: true });
});

// Delete an image (admin only)
router.delete('/clothes/images/:imageId', requireAdmin, async (req, res) => {
  const { imageId } = req.params;
  // Find the image
  const image = await ClothesImages.findByPk(imageId);
  if (image) {
    await deleteS3File(image.imageUrl);
    await image.destroy();
  }
  res.json({ success: true });
});

// List all categories
router.get('/categories', async (req, res) => {
  const { Category } = require('../../db/models');
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  res.json(categories);
});

// Create a new category (admin only)
router.post('/categories', requireAdmin, async (req, res) => {
  const { Category } = require('../../db/models');
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name required' });
  const [category, created] = await Category.findOrCreate({ where: { name } });
  if (!created) return res.status(409).json({ error: 'Category already exists' });
  res.status(201).json(category);
});

// Delete a category (admin only)
router.delete('/categories/:id', requireAdmin, async (req, res) => {
  const { Category, Clothes } = require('../../db/models');
  const { id } = req.params;
  // Optionally, set categoryId to null for clothes in this category
  await Clothes.update({ categoryId: null }, { where: { categoryId: id } });
  await Category.destroy({ where: { id } });
  res.json({ success: true });
});

// Edit a category (admin only)
router.put('/categories/:id', requireAdmin, async (req, res) => {
  const { Category } = require('../../db/models');
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name required' });
  const category = await Category.findByPk(id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  category.name = name;
  await category.save();
  res.json(category);
});


module.exports = router;
