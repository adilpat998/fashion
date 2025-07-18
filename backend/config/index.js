module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    dbFile: process.env.DB_FILE, // <-- added to fix SQLite path
    db: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        schema: process.env.SCHEMA
    },
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    }
};

console.log('Using DB_FILE:', process.env.DB_FILE);
