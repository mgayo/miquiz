var express = require('express');
var router = express.Router();
// Importamos el controlador básico
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'miQuiz' });
});

// Enlazamos las rutas con el controlador que debe gestionarlas
router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);

module.exports = router;
