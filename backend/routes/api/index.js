const router = require('express').Router();
const { Clothes, ClothesImages } = require('../../db/models');
const adminRouter = require('./admin.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // You can configure this as needed
const { requireAdmin } = require('./admin.js');


router.use('/admin', adminRouter);


// Get all clothes with images
router.get('/clothes', async (req, res) => {
  const clothes = await Clothes.findAll({
    include: [{ model: ClothesImages, as: 'images' }],
    order: [['createdAt', 'DESC']]
  });
  res.json(clothes);
});

// Add a new clothing item (admin only)
router.post('/clothes', requireAdmin, async (req, res) => {
  const { name, description, sizes, price } = req.body;
  const newClothes = await Clothes.create({ name, description, sizes, price, imageUrl: '' });
  res.status(201).json(newClothes);
});

// Add images to a clothing item (admin only, supports multiple)
router.post('/clothes/:id/images', requireAdmin, upload.array('images'), async (req, res) => {
  const { id } = req.params;
  // For demo, just use file paths; in production, upload to S3 or similar
  const files = req.files.map(file => ({ clothesId: id, imageUrl: file.path }));
  const images = await ClothesImages.bulkCreate(files);
  res.status(201).json(images);
});

// Delete a clothing item (admin only)
router.delete('/clothes/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  await Clothes.destroy({ where: { id } });
  res.json({ success: true });
});

// Delete an image (admin only)
router.delete('/clothes/images/:imageId', requireAdmin, async (req, res) => {
  const { imageId } = req.params;
  await ClothesImages.destroy({ where: { id: imageId } });
  res.json({ success: true });
});


module.exports = router;
