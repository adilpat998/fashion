const AWS = require('aws-sdk');
const multer = require('multer');

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
});

// Multer storage for single file upload
const storage = multer.memoryStorage();
const singleMulterUpload = (fieldName) => multer({ storage }).single(fieldName);
const multipleMulterUpload = (fieldName) => multer({ storage }).array(fieldName);

// Upload a single file to S3 and return the public URL
const singlePublicFileUpload = async (file) => {
  const Key = `${Date.now()}-${file.originalname}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
    Body: file.buffer
    // ACL: 'public-read' // Removed for buckets with ACLs disabled
  };
  const data = await s3.upload(uploadParams).promise();
  return data.Location;
};

// Upload multiple files to S3 and return an array of public URLs
const multiplePublicFileUpload = async (files) => {
  return await Promise.all(files.map(singlePublicFileUpload));
};

// Delete a file from S3 by its key
const deleteS3File = async (fileUrl) => {
  // Extract the key from the file URL
  const url = new URL(fileUrl);
  const Key = decodeURIComponent(url.pathname.replace(/^\//, ''));
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key
  };
  await s3.deleteObject(params).promise();
};

module.exports = {
  s3,
  singleMulterUpload,
  multipleMulterUpload,
  singlePublicFileUpload,
  multiplePublicFileUpload,
  deleteS3File
};