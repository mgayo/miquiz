var models = require('../models/models.js');

// Autoload
exports.load = function(req,res,next,quizId){
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {next(new Error('No existe quizId='+quizId));}
		} 
	).catch(function(error){next(error);});
};

// GET /quizes   (Todo el listado de preguntas)
exports.index = function(req,res){
	var consulta={};
	// Si hay par�metro de b�squeda armamos una consulta
	// si no la consulta permanece vac�a
	if (req.query.search) {
		var criterio=("%"+req.query.search.trim()+"%").replace(/\s/g,"%");
		consulta={where: ["pregunta like ?", criterio],
				  order: "pregunta ASC"};
	};
	// Se realiza la consulta. Si no hab�a par�metro de b�squeda la var consulta est� vacia
	models.Quiz.findAll(consulta).then(
		function(quizes) {
			res.render('quizes/index',{quizes:quizes});
		}
	).catch(function(error){next(error);});
};

// GET /quizes/:id   (una pregunta concreta)
exports.show = function(req,res){
	res.render('quizes/show',{quiz:req.quiz});
};

// GET /quizes/:id/answer   (Respuesta de una pregunta concreta)
exports.answer = function(req,res){
	var resultado='Incorrecta';
	if (req.query.respuesta===req.quiz.respuesta){
		resultado='Correcta';
	}
	res.render('quizes/answer',{quiz:req.quiz, respuesta:resultado});
};