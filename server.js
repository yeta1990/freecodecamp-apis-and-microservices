'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');
var bodyParser = require('body-parser');
const dns = require('dns');
const {nanoid} = require('nanoid');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here


app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});


const urlSchema = new mongoose.Schema({
  original_url : {type: String, required: true},
  short_url : {type: String, required: true}

});
const Urlmodel = mongoose.model('Urlmodel', urlSchema);


app.post('/api/shorturl/new', (req,res) => {
  //avergiuar último id almacenado en bbdd
  //crear modelo a almacenar
  // almacenarlo
  var shortId = nanoid(5);
  console.log(shortId);
  
  
  var urltosave = new Urlmodel({"original_url": req.body.url, "short_url": nanoid(5)});

  urltosave.save(function(err, doc) {
    if(err) return console.error(err);

     // data(null, data); 
  });

  res.json(urltosave);

});


app.get('/api/shorturl/:id', (req,res) => {

  var urltosave = findUrlByShortid(req.params.id, (err2, done)=> {
        if (err2) return console.error(err2);
        console.log("enviado" + done);
        res.redirect(301, done.original_url);
        

       // res.json(done.original_url);

      });
    
  });



  





var findUrlByShortid = function(shorturlid, done) {

  Urlmodel.findOne({short_url: shorturlid}, function(err,foundDoc){

    if (err) {
        return console.error(err);
      } else {
        console.log("localizado " + foundDoc);
        done(null,foundDoc);
    }

  })
};


/*
var lookForLastId = function(original_url,lastIdfound) {
  
  var id;


  Urlmodel.find({}).sort({short_url: 'desc'}).limit(1).exec(function(err,lastId) {
    if(err) {
      console.log(err);
    }else {
      id = +foundId.short_url;
      console.log('2.encontrado id. ' + id);
      console.log('3.encontrado id ' + lastId);
      
      lastId(null, id);
      
    }

  }
  );
  console.log("4.el id es " + id);
  lastIdfound(id);
 
}
*/
/*var createUrl



dns.lookup('example.com', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
*/