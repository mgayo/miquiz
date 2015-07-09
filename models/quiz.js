// Definición del modelo de Quiz
// Esto es, la tabla que albergará las preguntas (y respuestas)

module.exports = function(sequelize,DataTypes){
	return sequelize.define('Quiz',
	{ pregunta : DataTypes.STRING,
	  respuesta : DataTypes.STRING,
	});
}