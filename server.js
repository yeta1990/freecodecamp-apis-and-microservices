'use strict';

var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser')

// require and use "multer"...
var multer  = require('multer')
var upload = multer()




var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});


app.post('/api/fileanalyse', upload.single('upfile'),function(req,res,next){
    const file = req.file;
    const responseObject = {}
    if(!file){
      
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
    console.log(file.name);
    responseObject['name'] = file.originalname;
    responseObject['type'] = file.mimetype;
    responseObject['size'] = file.size;
    res.json(responseObject);
  

});
