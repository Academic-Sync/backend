const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/course');
const classesRoutes = require('./routes/class');
const studentsRoutes = require('./routes/student');
const advisorsRoutes = require('./routes/advisor');
const teachersRoutes = require('./routes/teacher');
const activitiesRoutes = require('./routes/activity');
const coordinatorsRoutes = require('./routes/coordinator');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const discordApiController = require('./controllers/DiscordApiController')
const auth = require('./middlewares/auth');
const path = require('path');
const app = express();
require('dotenv').config();

const defaultOrigins = [
    "https://piardigans.vercel.app", "https://academic-sync.vercel.app"
];

const corsOptions = {
    origin: (process.env.FRONTEND_ORIGINS ? process.env.FRONTEND_ORIGINS.split(',') : defaultOrigins),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'X-Requested-With', 'X-Custom-Header'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../uploads')));

// Middleware para tratar erros
app.use((err, req, res, next) => {
    // Enviar erro para o Discord
    discordApiController.sendErrorToDiscord(err.message);

    // Responder com erro
    // res.status(500).json({ message: 'Ocorreu um erro interno.' });
});

app.get('/', (req, res) => res.json("Hello World"));

// Rotas
app.use('/api/courses', auth, courseRoutes);
app.use('/api/classes', auth, classesRoutes);
app.use('/api/students', auth, studentsRoutes);
app.use('/api/advisors', auth, advisorsRoutes);
app.use('/api/teachers', auth, teachersRoutes);
app.use('/api/activities', auth, activitiesRoutes);
app.use('/api/coordinators', auth, coordinatorsRoutes);
app.use('/api', authRoutes);
app.use('/api', publicRoutes);

// Middleware para tratamento de erros do Multer
app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        // Erros específicos do Multer
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        // Outros erros gerais
        return res.status(500).json({ error: err.message });
    }
    next();
});

// Erro 404
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        status: 404
    });
});

module.exports = app;
