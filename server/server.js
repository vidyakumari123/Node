const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { join } = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "frontend", "index.html"));
});


function generateId() {
    return Math.random().toString(5).substr(2, 9);
}

app.post('/addData', (req, res) => {
    const newData = req.body;
    let db = [];
    if (fs.existsSync('db.json')) {
        db = JSON.parse(fs.readFileSync('db.json'));
    }
    newData.id = generateId(); // Assign a unique ID to the new data
    db.push(newData);
    fs.writeFileSync('db.json', JSON.stringify(db));
    res.json({ message: 'Data added successfully' });
});

app.delete('/deleteData/:id', (req, res) => {
    const id = req.params.id;
    let db = [];
    if (fs.existsSync('db.json')) {
        db = JSON.parse(fs.readFileSync('db.json'));
    }
    const newData = db.filter(item => item.id !== id);
    fs.writeFileSync('db.json', JSON.stringify(newData));
    res.json({ message: `Data with ID ${id} deleted successfully` });
});

app.delete('/deleteAllData', (req, res) => {
    fs.writeFileSync('db.json', '[]');
    res.json({ message: 'All data deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
