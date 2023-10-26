const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MySQL database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Y18ACE482@ngk',
    database: 'MASTER',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log(`Connected to MySQL on port ${port}`);
});

// API endpoint for user signup
app.post('/signup', async (req, res) => {
    try {
        const { UserName, Password, Email } = req.body; // Change to match the case

        // Check if the username already exists in the database
        const checkQuery = 'SELECT * FROM user1 WHERE UserName = ?'; // Change to match the case
        db.query(checkQuery, [UserName], async (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length > 0) {
                res.status(400).send('Username already exists');
                return;
            }

            // Generate a random salt
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);

            // Hash the user's password with the salt
            const hashedPassword = await bcrypt.hash(Password, salt); // Change to match the case

            // Store the username, salt, and hashed password in the database
            const insertQuery = 'INSERT INTO user1 (UserName, salt, Password, Email) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [UserName, salt, hashedPassword, Email], (error) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.status(201).send('User registered successfully');
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 