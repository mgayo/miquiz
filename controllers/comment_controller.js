var models = require ('../models/models.js');

// GET //quizes/:quizId/comments/new
exports.new = function(req,res){
	console.log('Entra en exports.new');
	res.render('comments/new.ejs',{quizid: req.params.quizId, errors:[]});
	console.log('Sale de exports.new');
};

// POST /quizes/:quizId/comments
exports.create = function(req,res){
	console.log('Entra en exports.crete');
	var comment = models.Comment.build(
	{ texto: req.body.comment.texto,
	  QuizId: req.params.quizId
	});
	
	comment.validate().then(
		function(err){
			if (err) {
				res.render('comments/new.ejs',{comment: comment, errors: err.errors});
			} else {
				comment // save; guarda en BD el campo de texto de comentario
				.save().then(function(){
					res.redirect('/quizes/'+req.params.quizId)})
			}	// res.redirect: Redirección HTTP a la lista de preguntas
		}	 
	).catch(function(error){next(error)});
	console.log('Sale de exports.create');
};