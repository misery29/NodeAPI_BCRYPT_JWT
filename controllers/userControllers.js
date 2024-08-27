const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Cadastro de Usuário
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Received request body:', req.body);

  if (!username || !email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let hashedPassword;
  try {
    console.log('Hashing password');
    hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
  } catch (hashError) {
    console.log('Error hashing password:', hashError.message);
    return res.status(500).json({ error: 'Error processing password' });
  }

  let user;
  try {
    console.log('Creating user');
    user = await User.create({ username, email, password: hashedPassword });
    console.log('User created successfully:', user);
  } catch (createError) {
    console.log('Error creating user:', createError.message);
    return res.status(500).json({ error: 'Error creating user' });
  }

  res.status(201).json({ message: 'User registered', user });
};

// Login de Usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request body:', req.body);

  if (!email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let user;
  try {
    console.log('Finding user by email');
    user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', user);
  } catch (findError) {
    console.log('Error finding user:', findError.message);
    return res.status(500).json({ error: 'Error finding user' });
  }

  let isMatch;
  try {
    console.log('Checking password');
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid password' });
    }
    console.log('Password matched');
  } catch (compareError) {
    console.log('Error comparing passwords:', compareError.message);
    return res.status(500).json({ error: 'Error comparing passwords' });
  }

  let token;
  try {
    token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token válido por 1 hora
    );
  } catch (tokenError) {
    return res.status(500).json({ error: 'Error generating token' });
  }

  res.status(200).json({ message: 'Login successful', token });
};

// Listagem de Usuários
exports.listUsers = async (req, res) => {
  console.log('Received request to list users');

  try {
    const users = await User.findAll();
    console.log('Users fetched successfully:', users);
    res.status(200).json({ users });
  } catch (findError) {
    console.log('Error fetching users:', findError.message);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Atualização de Usuário
exports.updateUser = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  console.log('Received request body for update:', req.body);

  if (!username && !email) {
    console.log('No fields provided for update');
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    console.log('User updated successfully:', user);
    res.status(200).json({ message: 'User updated', user });
  } catch (updateError) {
    console.log('Error updating user:', updateError.message);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Deleção de Usuário
exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  console.log('Received request to delete user with ID:', userId);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    console.log('User deleted successfully');
    res.status(200).json({ message: 'User deleted' });
  } catch (deleteError) {
    console.log('Error deleting user:', deleteError.message);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
