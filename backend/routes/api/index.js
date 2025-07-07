const router = require('express').Router();
const { Clothes, ClothesImages } = require('../../db/models');
const adminRouter = require('./admin.js');
const { requireAdmin } = require('./admin.js');
const { multipleMulterUpload, multiplePublicFileUpload, singleMulterUpload, singlePublicFileUpload, deleteS3File } = require('../../utils/awsS3');


router.use('/admin', adminRouter);


// Get all clothes with images and genre
router.get('/clothes', async (req, res) => {
  const { genreId } = req.query;
  const include = [
    { model: ClothesImages, as: 'images' },
    { association: 'genre' }
  ];
  const where = genreId ? { genreId } : undefined;
  const clothes = await Clothes.findAll({
    where,
    include,
    order: [['createdAt', 'DESC']]
  });
  res.json(clothes);
});

// Add a new clothing item (admin only, supports single image upload)
router.post('/clothes', requireAdmin, singleMulterUpload('image'), async (req, res) => {
  const { name, description, sizes, price, genreId } = req.body;
  let imageUrl = '';
  if (req.file) {
    imageUrl = await singlePublicFileUpload(req.file);
  }
  const newClothes = await Clothes.create({ name, description, sizes, price, imageUrl, genreId });
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

// Edit/update a clothing item (admin only, supports image replacement and genre change)
router.put('/clothes/:id', requireAdmin, singleMulterUpload('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, sizes, price, genreId } = req.body;
  const clothing = await Clothes.findByPk(id);
  if (!clothing) return res.status(404).json({ error: 'Clothing item not found' });

  let imageUrl = clothing.imageUrl;
  if (req.file) {
    // If a new image is uploaded, upload to S3 and update
    imageUrl = await singlePublicFileUpload(req.file);
    // Optionally, add to ClothesImages
    await ClothesImages.create({ clothesId: clothing.id, imageUrl });
  }

  await clothing.update({ name, description, sizes, price, imageUrl, genreId });
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

// List all genres
router.get('/genres', async (req, res) => {
  const { Genre } = require('../../db/models');
  const genres = await Genre.findAll({ order: [['name', 'ASC']] });
  res.json(genres);
});

// Create a new genre (admin only)
router.post('/genres', requireAdmin, async (req, res) => {
  const { Genre } = require('../../db/models');
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Genre name required' });
  const [genre, created] = await Genre.findOrCreate({ where: { name } });
  if (!created) return res.status(409).json({ error: 'Genre already exists' });
  res.status(201).json(genre);
});


module.exports = router;
