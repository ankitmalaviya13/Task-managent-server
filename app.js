const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes.js');
const projectRoutes = require('./Routes/projectRoutes.js');
const expertiseRoutes = require('./Routes/expertiseRoutes.js');
const rateRoutes = require('./Routes/rateRoute.js');
const path = require('path');

const app = express();

app.use(cors());
app.use(BodyParser.json());


app.use(BodyParser.urlencoded({ extended: true}));

app.use(express.static('public'));

app.use('/public', express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => { res.send('Welcome To Task Management') ; res.end();});
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/expertise', expertiseRoutes);

app.use('/api/rate', rateRoutes);



module.exports = { app };