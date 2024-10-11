const {Sequelize}=require('sequelize')

const URI='postgresql://postgres.oooswihukhbjbfauxrta:Eventprobd01*@aws-0-us-west-1.pooler.supabase.com:6543/postgres'

const sequelize= new Sequelize(URI,{
    dialect:'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false 
          },
          useUTC:false
    },
    logging:false,
    timezone:'-05:00'
    
  });

  sequelize.authenticate()
  .then(()=>console.log('Conexion a la base de datos exitosa'))
  .catch(err=>console.error('Error al conectar a la base de datos:',err));
  
  module.exports = sequelize;