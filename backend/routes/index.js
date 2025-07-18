// backend/routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path')
const apiRouter = require('./api');


router.use('/api', apiRouter);
// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });

    // Serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve("../frontend/dist")));

    // Serve the frontend's index.html file at all other routes NOT starting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });
}

// Removed CSRF restore route in development

module.exports = router;
