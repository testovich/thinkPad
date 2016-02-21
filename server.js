var express = require('express');
var Firebase = require('firebase');
var bodyParser = require('body-parser');
var app = express();


//Server configs
var config = require('./core/config/options');

var firebase = new Firebase("https://resplendent-fire-832.firebaseio.com/");

// User
var db = {name: 'Тестер'};

// Configuration
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/* ======== API ======== */

// index page
app.get('/', function(req, res) {
    res.render('layouts/cabinet', db);
});

var userNotes = firebase.child('posts');

// Get all notes
app.get('/get', function(req, res) {
    var notes = [];

    userNotes.once('value', function (posts){
        posts.forEach(function(childSnapshot) {
            notes.push({
                key: childSnapshot.key(),
                item: childSnapshot.val()
            });
        });

        res.send({success:true, data: notes});
    });
});

// Search notes
app.get('/search', function(req, res) {

});

// Add note
app.post('/add', function(req, res) {
    var nodeID = userNotes.push({
        name: req.body.name,
        description: req.body.description,
        publish: req.body.publish
    }, function (err){
        if (err) {
            res.send({success:false, errors: err});
        }
        else {
            if(nodeID.key()) {
                res.send({success:true, key:nodeID.key()});
            }
        }
    });
});

//Remove note
app.post('/remove', function(req, res) {
    userNotes.child(req.body.key).remove(function(){
        res.send({success:true});
    });
});
//Start server
app.listen(config.server.port, function(){
    console.log(config.server.notice);
});