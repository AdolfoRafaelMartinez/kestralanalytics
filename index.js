const express = require('express');
const path = require('path');

// Import the Firebase Admin configuration
const { db, firebaseStatus } = require('./config/firebase');

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  // Pass the firebaseStatus to the template
  res.render('index', { firebaseStatus });
});

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

// Add a sample route to fetch data from Firestore
app.get('/api/users', async (req, res) => {
  try {
    // Check if the database is initialized
    if (!db) {
      return res.status(500).send('Firestore is not connected.');
    }
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
