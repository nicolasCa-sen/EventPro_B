const express = require('express')
const {Lugar,Evento,Organizacion}=require('./models/asociacion')
const app = express()
const cors=require('cors')

//connect-DB
require('./drivers/connect_db')

//setters
app.set('PORT',process.env.PORT || 3000 )

//middlewares
app.use(express.json())
app.use(cors());
app.use("/lugar", require('./routes/lugarRoutes'))
app.use("/organizacion", require('./routes/organizacionRoutes'))
app.use("/evento",require('./routes/eventoRoutes'))
//app.use("/usuario",require('./routes/usuario'))
app.listen(app.get('PORT'),()=>console.log(`Sever Listen to Port ${app.get('PORT')}`))