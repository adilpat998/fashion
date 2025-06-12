const router = require('express').Router();
const { Clothes, ClothesImages } = require('../../db/models');
const adminRouter = require('./admin.js');
const { requireAdmin } = require('./admin.js');
const { multipleMulterUpload, multiplePublicFileUpload, singleMulterUpload, singlePublicFileUpload, deleteS3File } = require('../../utils/awsS3');


router.use('/admin', adminRouter);


// Get all clothes with images
router.get('/clothes', async (req, res) => {
  const clothes = await Clothes.findAll({
    include: [{ model: ClothesImages, as: 'images' }],
    order: [['createdAt', 'DESC']]
  });
  res.json(clothes);
});

// Add a new clothing item (admin only, supports single image upload)
router.post('/clothes', requireAdmin, singleMulterUpload('image'), async (req, res) => {
  const { name, description, sizes, price } = req.body;
  let imageUrl = '';
  if (req.file) {
    imageUrl = await singlePublicFileUpload(req.file);
  }
  const newClothes = await Clothes.create({ name, description, sizes, price, imageUrl });
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


module.exports = router;
