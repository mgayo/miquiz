var express = require('express');
var router = express.Router();
// Importamos el controlador básico
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'miQuiz' });
});

// Enlazamos las rutas con el controlador que debe gestionarlas
router.get('/quizes',quizController.index);
router.get('/quizes/:quidId(\\d+)',quizController.show);
router.get('/quizes/:quidId(\\d+)/answer',quizController.answer);

// Enlace a la página que muestra los créditos
router.get('/author',function(req,res){
	res.render('author',{nombre:'Mario Gayo',foto:'images/mgayo.png'});
});

module.exports = router;
