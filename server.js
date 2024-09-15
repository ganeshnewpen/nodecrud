// server.js

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js CRUD API!');
});

// Test DB connection
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Database connection failed');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



//Create a new user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
  
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }
  
    try {
      const [result] = await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
      res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
  

  app.get('/users', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update a user by ID
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
  
    // Basic validation
    if (!name && !email) {
      return res.status(400).json({ message: 'At least one field (name or email) is required to update' });
    }
  
    try {
      // Check if user exists
      const [existingUser] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  
      if (existingUser.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      const updatedName = name || existingUser[0].name;
      const updatedEmail = email || existingUser[0].email;
  
      await db.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [updatedName, updatedEmail, id]);
  
      res.json({ message: 'User updated' });
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if user exists
      const [existingUser] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  
      if (existingUser.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user
      await db.execute('DELETE FROM users WHERE id = ?', [id]);
  
      res.json({ message: 'User deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
