const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db.json");
const app = express();
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + "/public"));
app.use(express.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.listen(port);
console.log(`listening on port ${port}`);

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/notes.html"));
});


//GET data request 
app.get("/api/noteGET", function (req, res) {
    console.log(db)
    res.json(db);

});



//POST data request (add and overwrite)
app.post("/api/notePOST", function (req, res) {
    let data = req.body;
    console.log(data)
    let array = db;
    let repeat = false;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == data.id) {
            repeat = true;
            array[i].title = data.title;
            array[i].text = data.text;
        }
    }
    array.sort(function (a, b) {
        return a.id - b.id;
    });
    if (repeat == false) {
        array[array.length] = data;
    }
    console.log(array)
    fs.writeFile(
        __dirname + "/db/db.json",
        JSON.stringify(array),
        function (err) {
            if (err) {
                throw err;
            } else {
                return;
            }
        }
    );

    res.json(array);
});


//DELETE data request
app.post("/api/noteDEL", function (req, res) {
    let data = req.body;
    console.log(data.id)
    console.log(req.method);
    let array = db;
    let array2 = [];
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == data.id) {    
            array.splice(i, 1);
        }
    }
    array2 = array
    console.log(array2);
    for (let i = 0; i < array2.length; i++) {
        array2[i].id = i + 1;
    }
    array2.sort(function (a, b) {
        return a.id - b.id;
    });
    console.log(array2);
    fs.writeFile(
        __dirname + "/db/db.json",
        JSON.stringify(array2),
        function (err) {
            if (err) {
                throw err;
            } else {
                return;
            }
        }
    );

    res.json(array2);
});
