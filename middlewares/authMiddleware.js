const jwt = require('jsonwebtoken');

// Middleware para autenticação de token JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token

  if (token == null) return res.status(401).json({ error: 'Token not provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user; // Adiciona o usuário ao req
    next(); // Continua para a próxima rota
  });
};
