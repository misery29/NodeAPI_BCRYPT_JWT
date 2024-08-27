const express = require('express');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

app.use(express.json()); // Middleware para processar JSON

// Rotas
app.use('/users', userRoutes);

// Rota padrão para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sincronize o banco de dados
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

// Inicialize o servidor
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
