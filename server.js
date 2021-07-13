// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

var isInteger = function(req,res){
  if (Number.isInteger(+req)) {
      console.log(req + ' número')
   return true } else {
     console.log('mierda');
   }

}

app.get("/api/timestamp/",
  function(req,res) {
    res.json(
        mensaje(new Date(), (err, message) => {
          if (err) throw console.log(err);
          done(null, message);
        })
      );

  }
);
app.get('/api/timestamp/:date_string', 
  
  function(req,res,next) {
    if (isInteger(req.params.date_string, function(err,data)
    {
      if(err) throw console.log(err);
      done(null, true)

      })
    )
    {
        
        
       res.json(
        mensaje(new Date(+req.params.date_string), (err, message) => {
          if (err) throw console.log(err);
          done(null, message);
        })
      );

    } else if 
    (
      (req.params.date_string.length = 10)
      &&
      (req.params.date_string.match(/[0-9]{4}-[0-12]{2}-[0-9]{2}/g)) 
    ){
        res.json(
        mensaje(new Date(req.params.date_string), (err, message) => {
          if (err) throw console.log(err);
          done(null, message);
        })
      );
         
    } else {
      res.json({"error" : "Invalid Date" });
    }

   /*

    if (req.params.date_string != null){
      
      res.json(
        mensaje(new Date(req.params.date_string), (err, message) => {
          if (err) throw console.log(err);
          done(null, message);
        })
      );

    }else {
            res.json(
        mensaje(new Date(), (err, message) => {
          if (err) throw console.log(err);
          done(null, message);
        })
      );

    }
*/

   
    
    
});

var mensaje = function(dateInput){
  
  var messageOutput = 
    {unix: dateInput.getTime(), utc: dateInput.toUTCString()};
  return messageOutput;
 

}

var isValidDate = function(req,res) {
  
  return false;
};