const routes = require('express').Router();
const adminController = require('../controllers/admin.controller.js');
const auth = require('../middleware/admin.auth.js');

routes.post('/register', adminController.register);
routes.post('/login', adminController.login);
routes.get('/getUsers', auth, adminController.getUsers);
routes.get('/getQuestions',auth, adminController.getQuestions);
routes.post('/addQuestion',auth, adminController.addQuestion);
routes.patch('/updateQuestion/:id',auth, adminController.updateQuestion);
routes.delete('/deleteQuestion/:id',auth, adminController.deleteQuestion);
routes.post('/generateQuestionPaper',auth, adminController.makeQuestionPaper);
routes.get('/getQuestionPapers',auth, adminController.getQuestionPapers);
routes.get('/getQuestionPaper/:id',auth, adminController.getQuestionPaper);
routes.get('/tests',auth, adminController.getTests);

module.exports = routes;