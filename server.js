require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// 🌐 CORS и JSON-парсинг
app.use(cors());
app.use(bodyParser.json());

// 📂 Раздача статики (если нужно отдавать какие-то файлы из корня)
app.use(express.static(__dirname));

// 🔌 Подключение к PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER     || 'postgres',
  host: process.env.PGHOST     || 'localhost',
  database: process.env.PGDATABASE || 'MYAU',
  password: process.env.PGPASSWORD || 'admin',
  port: process.env.PGPORT     ? parseInt(process.env.PGPORT) : 5432,
});

pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

// 📋 Создание таблицы users (если ещё нет)
pool
  .query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      registration_date TIMESTAMP DEFAULT NOW()
    );
  `)
  .catch(err => console.error('❌ Error creating users table:', err));


// ================= Регистрация =================
// === Регистрация ===
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Заполните все поля!' });
  }
  try {
    // ищем пользователя с таким email или логином
    const { rows } = await pool.query(
      'SELECT username, email FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (rows.length > 0) {
      // определяем, что именно занято
      let msg = '';
      if (rows[0].email === email && rows[0].username === username) {
        msg = 'Этот email и логин уже заняты!';
      } else if (rows[0].email === email) {
        msg = 'Этот email уже зарегистрирован!';
      } else {
        msg = 'Этот логин уже занят!';
      }
      return res.status(400).json({ error: msg });
    }
    // ... остальной код не меняется
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, registration_date`,
      [username, email, password_hash]
    );
    res.json({
      message: 'Регистрация успешна!',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});



// ================= Логин =================
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Заполните логин/email и пароль!' });
  }
  try {
    // ищем пользователя либо по email, либо по username
    const { rows } = await pool.query(
      `SELECT id, username, email, password_hash, registration_date
       FROM users
       WHERE email = $1 OR username = $1
       LIMIT 1`,
      [identifier]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Неправильный логин/email или пароль' });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Неправильный логин/email или пароль' });
    }
    res.json({
      message: 'Вход успешен!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        registration_date: user.registration_date
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});



// ================= Профиль =================
// Пример: GET /api/profile?email=user@example.com
app.get('/api/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email обязателен!' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, registration_date
       FROM users
       WHERE email = $1`,
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Profile error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ================= Заказы =================
app.post('/api/orders', async (req, res) => {
  const { userId, cart, name, lastname, phone, address } = req.body;
  if (!userId || !cart || !name || !lastname || !phone || !address) {
    return res.status(400).json({ error: 'Не все поля заполнены' });
  }
  try {
    await pool.query(
      `INSERT INTO orders (user_id, order_data, name, lastname, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, JSON.stringify(cart), name, lastname, phone, address]
    );
    res.json({ message: 'Заказ успешно оформлен!' });
  } catch (err) {
    console.error('❌ Order error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/orders', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Нет userId' });
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`, [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Orders fetch error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/orders', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Нет userId' });
  try {
    await pool.query('DELETE FROM orders WHERE user_id = $1', [userId]);
    res.json({ message: 'Все заказы удалены' });
  } catch (err) {
    console.error('❌ Orders delete error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// 🚀 Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
