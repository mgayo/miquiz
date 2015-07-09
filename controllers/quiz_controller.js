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
	models.Quiz.findAll().then(
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