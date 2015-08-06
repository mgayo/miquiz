var express = require('express');
var multer = require('multer');
var router = express.Router();
// Importamos el controlador básico
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'miQuiz',errors:[]});
});

// Autoload de comandos con :quizId
router.param('quizId',quizController.load); 		// autoload :quizId
router.param('commentId',commentController.load);	// autoload :commentId
router.param('userId',userController.load);			// autoload :userId

// Definición de las rutas de sesión
router.get('/login',sessionController.new);			// Formulario login
router.post('/login',sessionController.create);		// Crear sesión
router.get('/logout',sessionController.destroy);	// Destruir sesión (preferible con DELETE)

// Definición de rutas de cuenta
router.get('/user',userController.new);				// Formulario de registro
router.post('/user',userController.create);			// Registrar nuevo usuario
router.get('/user/:userId(\\d+)/edit',sessionController.loginRequired,userController.ownershipRequired,userController.edit);
router.put('/user/:userId(\\d+)',sessionController.loginRequired,userController.ownershipRequired,userController.update);
router.delete('/user/:userId(\\d+)',sessionController.loginRequired,userController.ownershipRequired,userController.destroy);
router.get('/user/:userId(\\d+)/quizes',quizController.indexmias);

// Enlazamos las rutas con el controlador que debe gestionarlas
router.get('/quizes',quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
router.get('/quizes/new',sessionController.loginRequired,quizController.new);
router.post('/quizes/create',sessionController.loginRequired,
							multer({dest: './public/media/'}),
							quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.ownershipRequired,quizController.edit);
router.put('/quizes/:quizId(\\d+)',sessionController.loginRequired,
									quizController.ownershipRequired,
									multer({dest: './public/media/'}),
									quizController.update);
router.delete('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.ownershipRequired,quizController.destroy);

// Enlazamos las rutas que gestionan los comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
			sessionController.loginRequired,commentController.ownershipRequired,commentController.publish); // debería utilizarse PUT en lugar de GET

// Enlace a la página que muestra los créditos
router.get('/author',function(req,res){
	res.render('author',{nombre:'Mario Gayo',foto:'images/mgayo.png',errors:[]});
});

// Enlace a la página de las estadísticas
router.get('/quizes/estadisticas',quizController.estadisticas);

module.exports = router;
