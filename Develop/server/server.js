const express = require ('express');
const fs =require('fs');
const path = require ('path');
const notes = require('./data/db.json')
const {v4 : uuidv4} = require('uuid');
const { dirname } = require('path');

const PORT = process.env.PORT || 3001;
const app = express ();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.post('/api/notes', (req, res) => {
    console.log(req.body);
        res.json(req.body);

        const newNote = ({
            id: uuidv4(),
            ...req.body
        })
    notes.push(newNote);

    fs.writeFileSync(
        path.join(__dirname,'./data/db.json'),
        JSON.stringify(notes, null, 2)
    );
    return notes;
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    for (let i = 0; i < notes.length; i++) {

        if (notes[i].id == req.params.id) {
            notes.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(
        path.join(__dirname,'./data/db.json'), 
        JSON.stringify(notes, null, 2), 
    );
    res.json(notes)
});
app.listen (PORT, () => {
    console.log(`API server is now on port ${PORT}!`);
});