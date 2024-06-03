const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self';"
  );
  next();
});

app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quarklift'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (err, result) => {
      if (err) throw err;
      res.sendStatus(201);
    }
  );
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.sendStatus(401);

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.sendStatus(401);

    const token = jwt.sign({ userId: user.id }, 'secretkey');
    res.json({ token });
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    next();
  });
};

app.post('/log', verifyToken, (req, res) => {
  const { date, exercise, weight, reps, sets, likes } = req.body;
  db.query(
    'INSERT INTO workouts (user_id, date, exercise, weight, reps, sets, likes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.userId, date, exercise, weight, reps, sets, likes],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ id: result.insertId }); // Return the inserted ID
    }
  );
});

app.put('/log/:id', verifyToken, (req, res) => {
  const { date, exercise, weight, reps, sets, likes } = req.body;
  console.log('Received update data:', req.body);
  db.query(
    'UPDATE workouts SET date = ?, exercise = ?, weight = ?, reps = ?, sets = ?, likes = ? WHERE id = ? AND user_id = ?',
    [date, exercise, weight, reps, sets, likes, req.params.id, req.userId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log('Update result:', result);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }
      res.sendStatus(200);
    }
  );
});

app.delete('/log/:id', verifyToken, (req, res) => {
  db.query(
    'DELETE FROM workouts WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }
      res.sendStatus(200);
    }
  );
});

app.get('/leaderboard', verifyToken, (req, res) => {
  db.query('SELECT users.username, workouts.exercise, workouts.weight, workouts.reps, workouts.sets, workouts.likes FROM workouts JOIN users ON workouts.user_id = users.id ORDER BY workouts.likes DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/workouts', verifyToken, (req, res) => {
  db.query('SELECT * FROM workouts WHERE user_id = ?', [req.userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
