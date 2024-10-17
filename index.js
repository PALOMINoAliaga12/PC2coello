import express from 'express';
import moment from 'moment';
import { engine } from 'express-handlebars';
import connectDB from './db.js';
import Libro from './models/Libro.js';
import Categoria from './models/Categoria.js';
import { formatDate } from './helpers.js';

const app = express();

// Conectar a MongoDB
connectDB();

// Configuración del motor de plantillas Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    helpers: { 
        formatDate
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Configuración para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static('public'));

// Rutas para Libros
app.get('/', async (req, res) => {
    try {
        const libros = await Libro.find();
        res.render('libros/list', { libros });
    } catch (err) {
        console.error('Error al obtener los libros:', err);
        res.status(500).send('Error al obtener los libros');
    }
});

app.get('/libros/list', async (req, res) => {
    try {
        // Usamos .populate para traer los detalles de la categoría asociada
        const libros = await Libro.find().populate('id_categoria');
        res.render('libros/list', { libros });
    } catch (err) {
        console.error('Error al obtener los libros:', err);
        res.status(500).send('Error al obtener los libros');
    }
});


// Ruta para mostrar el formulario de añadir un libro
app.get('/libros/add', async (req, res) => {
    try {
        const categorias = await Categoria.find(); // Obtenemos todas las categorías
        res.render('libros/add', { categorias });
    } catch (err) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).send('Error al obtener las categorías');
    }
});


// Ruta para añadir un libro (método POST)
app.post('/libros/add', async (req, res) => {
    try {
        const nuevoLibro = new Libro(req.body);
        await nuevoLibro.save();
        res.redirect('/libros/list');
    } catch (err) {
        console.error('Error al añadir el libro:', err);
        res.status(500).send('Error al añadir el libro');
    }
});

// Ruta para mostrar el formulario de edición de un libro
app.get('/libros/edit/:id', async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        const categorias = await Categoria.find();

        // Formatear fechas para el formulario
        if (libro.fecha_publicacion && moment(libro.fecha_publicacion).isValid()) {
            libro.fecha_publicacion = moment(libro.fecha_publicacion).format('YYYY-MM-DD');
        }

        res.render('libros/edit', { libro, categorias });
    } catch (err) {
        console.error('Error al obtener el libro para editar:', err);
        res.status(500).send('Error al obtener el libro para editar');
    }
});

// Ruta para procesar la actualización de un libro (método POST)
app.post('/libros/edit/:id', async (req, res) => {
    try {
        await Libro.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/libros/list');
    } catch (err) {
        console.error('Error al actualizar el libro:', err);
        res.status(500).send('Error al actualizar el libro');
    }
});

// Ruta para eliminar un libro
app.post('/libros/delete/:id', async (req, res) => {
    try {
        await Libro.findByIdAndDelete(req.params.id);
        res.redirect('/libros/list');
    } catch (err) {
        console.error('Error al eliminar el libro:', err);
        res.status(500).send('Error al eliminar el libro');
    }
});

// Rutas para Categorías
app.get('/categorias/list', async (req, res) => {
    try {
        const categorias = await Categoria.find(); 
        res.render('categorias/list', { categorias });
    } catch (err) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).send('Error al obtener las categorías');
    }
});

// Ruta para mostrar el formulario de añadir una categoría
app.get('/categorias/add', (req, res) => {
    res.render('categorias/add');
});

// Ruta para añadir una categoría (método POST)
app.post('/categorias/add', async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save();
        res.redirect('/categorias/list');
    } catch (err) {
        console.error('Error al añadir la categoría:', err);
        res.status(500).send('Error al añadir la categoría');
    }
});

// Ruta para mostrar el formulario de edición de una categoría
app.get('/categorias/edit/:id', async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        res.render('categorias/edit', { categoria });
    } catch (err) {
        console.error('Error al obtener la categoría para editar:', err);
        res.status(500).send('Error al obtener la categoría para editar');
    }
});

// Ruta para procesar la actualización de una categoría (método POST)
app.post('/categorias/edit/:id', async (req, res) => {
    try {
        await Categoria.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/categorias/list');
    } catch (err) {
        console.error('Error al actualizar la categoría:', err);
        res.status(500).send('Error al actualizar la categoría');
    }
});

// Ruta para eliminar una categoría con confirmación
app.post('/categorias/delete/:id', async (req, res) => {
    try {
        await Categoria.findByIdAndDelete(req.params.id);
        res.redirect('/categorias/list');
    } catch (err) {
        console.error('Error al eliminar la categoría:', err);
        res.status(500).send('Error al eliminar la categoría');
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});
