var models = require('../models/models.js');

// Autoload
exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where:{id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(
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
	req.body.quiz.UserId=req.session.user.id;
	var quiz = models.Quiz.build(req.body.quiz);
	// Guarda en la BD los campos pregunta y respuesta de quiz
	quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/new',{quiz:quiz,errors:err.errors});
			} else {
				quiz
				.save({fields:["pregunta","respuesta","tema","UserId"]})
				.then(function(){res.redirect('/quizes')})
			}
		}
	).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit',{quiz:quiz,errors:[]});
};

//PUT /quizes/:id
exports.update=function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.validate()
	.then(
		function(err){
			if (err) {
				res.render('/quizes/edit',{quiz:req.quiz,errors:err.errors});
			} else {
				req.quiz
				.save({fields:["pregunta","respuesta","tema"]})
				.then(function(){res.redirect('/quizes');});
			}
		}
	);
}

//DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

//GET /quizes/estadisticas
exports.estadisticas = function(req,res){
	models.Quiz.count().then(function (_npreg){
		models.Comment.count().then(function (_ncoment){
			var _promedio= _ncoment / _npreg;
			models.Quiz.findAll({
				include:[{model: models.Comment}]
			}).then(function (quizes){
				var _pregcon = 0;
				for (i in quizes){
					if (quizes[i].Comments.length)
						_pregcon++;
				}
				var _pregsin = _npreg - _pregcon;
				res.render('quizes/estadisticas', {npreg: _npreg,
													ncoment: _ncoment,
													promedio: _promedio,
													pregcon: _pregcon,
													pregsin: _pregsin,
													errors: []});
			})
		})
	});
};