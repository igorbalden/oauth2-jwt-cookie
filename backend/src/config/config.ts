export default {

  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  DB: {
    URI: process.env.MONGODB_URI,
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD,
  }
  
};
