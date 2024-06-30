const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

let users = []; // This should be replaced with a database in a real application

app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static files from the "public" directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

console.log("Server is initializing...");

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.send('Welcome to the dashboard! i am Siva from Cse B studying 3rd year.');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    res.redirect('/');
  } else {
    res.send('Invalid username or password');
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, password: hashedPassword };

  users.push(user);
  req.session.userId = user.id;
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
