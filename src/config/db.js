const mongoose = require('mongoose');

const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }

    if (mongoose.connection.readyState) {
        console.log("MongoDB is already connected.");
        
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongo Connection successfully established.");
    } catch (error){
        console.error("Error connecting to mongoose:",error);
    }
};

module.exports = { connectDB };
