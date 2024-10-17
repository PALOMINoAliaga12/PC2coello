import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema({
    id_categoria: { type: Number, required: true },
    nombre_categoria: { type: String, required: true },
    descripcion: { type: String, required: true },
});

export default mongoose.model('Categoria', CategoriaSchema);
