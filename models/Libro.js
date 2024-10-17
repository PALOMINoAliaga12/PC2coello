import mongoose from 'mongoose';

const LibroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 45
    },
    autor: {
        type: String,
        required: true,
        maxlength: 45
    },
    portada: {
        type: String,
        maxlength: 45 // Podría ser una URL o un nombre de archivo
    },
    id_categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    fecha_publicacion: {
        type: Date,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        maxlength: 45
    },
    cantidad_disponible: {
        type: Number,
        required: true,
        min: 0 // No se permiten cantidades negativas
    }
});

// Eliminé el campo "id_libro" ya que MongoDB genera automáticamente un "_id" único por cada documento.

const Libro = mongoose.model('Libro', LibroSchema);
export default Libro;
