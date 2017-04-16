const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8081
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/uwc-showcase-server'
  }
};

module.exports = config;
