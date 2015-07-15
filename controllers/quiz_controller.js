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
			res.render('quizes/index',{quizes:quizes,errors:[]});
		}
	).catch(function(error){next(error);});
};

// GET /quizes/:id   (una pregunta concreta)
exports.show = function(req,res){
	res.render('quizes/show',{quiz:req.quiz,errors:[]});
};

// GET /quizes/:id/answer   (Respuesta de una pregunta concreta)
exports.answer = function(req,res){
	var resultado='Incorrecta';
	if (req.query.respuesta===req.quiz.respuesta){
		resultado='Correcta';
	}
	res.render('quizes/answer',{quiz:req.quiz, respuesta:resultado,errors:[]});
};

// GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build(
	{pregunta:"Pregunta",respuesta:"Respuesta"}
	);
	res.render('quizes/new',{quiz:quiz,errors:[]});
};

// POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/new',{quiz:quiz,errors:err.errors});
			} else {
				quiz
				.save({fields:["pregunta","respuesta"]})
				.then(function(){res.redirect('/quizes')})
			}
		}
	)
};