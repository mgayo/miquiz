var path = require('path');

// Cargar Model ORM
var Sequelize = require('sequelize');

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