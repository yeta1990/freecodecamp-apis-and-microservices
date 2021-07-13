const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')

//mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/exercise-track' )
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const exerciseSchema = new mongoose.Schema({
  description : {type: String, required: true},
  duration : {type: Number, required: true},
  date : String

})

const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new mongoose.Schema({
  username : {type: String, required: true},
  log: [exerciseSchema]
  
});
const User = mongoose.model('User', userSchema);




app.post("/api/exercise/new-user", (req,res) => {

  var usertosave = new User({"username": req.body.username});

  usertosave.save(function(err, doc) {
    if(err) return console.error(err);
    res.json(doc);
      
  });
  

});

app.get('/api/exercise/users', (req,res)=> {
  User.find({}, function(err, users){
    if (!err) {
      res.json(users);
    }

  })

});



app.post("/api/exercise/add", (req,res) => {

   var exercisetosave = new Exercise({
  "description": req.body.description, 
  "duration": parseInt(req.body.duration),
  "date": req.body.date});

  if(exercisetosave.date === ''){
    exercisetosave.date = new Date().toISOString().substring(0,10);
  }

  User.findByIdAndUpdate(
    req.body.userId, 
    {$push: {log: exercisetosave}},
    {new: true},
    (error, updatedUser)=>{
      let responseObject = {};
      responseObject['_id'] = updatedUser.id;
      responseObject['username'] = updatedUser.username;
      responseObject['date'] = new Date(exercisetosave.date).toDateString();
      responseObject['description'] = exercisetosave.description;
      responseObject['duration'] = exercisetosave.duration;
      res.json(responseObject);

    }
  );


});

app.get('/api/exercise/log', (request, response) => {
  User.findById(request.query.userId, (error, result)=> {
    if(!error){
      let responseObject = result;


      if(request.query.from || request.query.to) {

          let fromDate = new Date(0);
          let toDate = new Date();

          if(request.query.from){
            fromDate = new Date(request.query.from)

          }

          if(request.query.to){
            toDate = new Date(request.query.to)
          }

          fromDate = fromDate.getTime();
          toDate = toDate.getTime();

          responseObject.log = responseObject.log.filter((session) => {
            let sessionDate = new Date(session.date).getTime();

            return sessionDate >= fromDate && sessionDate <= toDate

          })

      }

      if(request.query.limit){
        responseObject.log = responseObject.log.slice(0, request.query.limit);
      }



      responseObject['count'] = result.log.length;
      response.json(responseObject);

    }

  })

} );




// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
