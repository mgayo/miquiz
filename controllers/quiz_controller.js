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
	// Si hay parámetro de búsqueda armamos una consulta
	// si no la consulta permanece vacía
	if (req.query.search) {
		var criterio=("%"+req.query.search.trim()+"%").replace(/\s/g,"%");
		consulta={where: ["pregunta like ?", criterio],
				  order: "pregunta ASC"};
	};
	// Se realiza la consulta. Si no había parámetro de búsqueda la var consulta está vacia
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

// GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build(
	{pregunta:"Pregunta",respuesta:"Respuesta"}
	);
	res.render('quizes/new',{quiz:quiz});
};

// POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);
	// Guarda en la BD los campos pregunta y respuesta de quiz
	quiz.save({fields:["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	})
};