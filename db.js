import mongoose from 'mongoose';

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/biblioteca'); // Asegúrate de que el nombre de la base de datos es el correcto
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
        process.exit(1); 
    }
};

export default connectDB;
