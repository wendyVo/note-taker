const express = require("express");
const path = require("path");
const fs = require("fs");
const shortid = require('shortid');

const app = express();
const PORT = 3000;
const pathDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//=> HTML GET Requests
app.get("/notes", function(req, res) {
    res.sendFile(path.join(pathDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let noteArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(noteArray[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(pathDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let noteArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    noteArray.id = shortid.generate();
    noteArray.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(noteArray));
    console.log("Note saved : ", newNote);
    res.json(noteArray);
})

app.delete("/api/notes/:id", function(req, res) {
    let noteArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    noteArray = noteArray.filter(savedNote => {
        return savedNote.id != noteID;
    })

    for (savedNote of noteArray) {
        savedNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(noteArray));
    res.json(noteArray);
})

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`);
})