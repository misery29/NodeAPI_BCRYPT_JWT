const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userControllers');


router.post('/register', userController.register);
router.post('/login', userController.login);

// Rotas protegidas
router.get('/users', authMiddleware.authenticateToken, userController.listUsers);
router.put('/users', authMiddleware.authenticateToken, userController.updateUser);
router.delete('/users', authMiddleware.authenticateToken, userController.deleteUser);

module.exports = router;
