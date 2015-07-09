var path = require('path');

// Postgres DATABASE_URL = postgres://user:passw@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Model ORM
var Sequelize = require('sequelize');

// Usar BD SQLite oo Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
	{ dialect:protocol,
	  protocol:protocol,
	  port:port,
	  host:host,
	  storage:storage, // solo SQLite (.env)
	  omitNull:true    // solo Postgres
	}
);

// Usar BD SQLite
var sequelize = new Sequelize(null,null,null,
						{dialect:"sqlite",storage:"quiz.sqlite"}
					);

// Importar la definición de la tabla Quiz en qui.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // Exportar definición de tabla Quiz

// sequelize.sync() crea e innicializa tabla de preguntas en BD
sequelize.sync().then(function() {
	// success(..) ejecuta el manejador una vez creada la tabla (cambiado por then)
	Quiz.count().then(function (count){
		if (count===0) { // la tabla solo se inicializa si está vacía
			Quiz.create({pregunta:'Capital de Italia',
						 respuesta:'Roma'
						}).then(function(){console.log('Base de datos inicializada')});
		};
	});
});