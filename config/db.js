const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('✅ Connessione a MongoDB riuscita');
  } catch (err) {
    console.error('❌ Errore di connessione MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
