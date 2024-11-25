const express = require('express');
const path = require('path');
const {Lugar,Evento,Organizacion}=require('./models/asociacion')
const app = express()
const cors=require('cors')

//connect-DB
require('./drivers/connect_db')

//setters
app.set('PORT',process.env.PORT || 4000 )

//middlewares
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.urlencoded({ extended: true }));

app.use("/lugar", require('./routes/lugarRoutes'))
app.use("/organizacion", require('./routes/organizacionRoutes'))
app.use("/evento",require('./routes/eventoRoutes'))
app.use("/usuario",require('./routes/usuarioRoutes'))
app.use("/admin",require('./routes/adminRoutes'))
app.use("/organizador",require('./routes/organizadorRoutes'))
app.use("/entrada",require('./routes/entradaRoutes'))
app.use("/auth", require('./routes/loginRoutes')) 
app.listen(app.get('PORT'),()=>console.log(`Sever Listen to Port ${app.get('PORT')}`))