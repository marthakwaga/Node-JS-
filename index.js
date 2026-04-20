//1. Dependencies
const express = require('express');
const expressSession = require('express-session')
const path = require('path')

//2. Instantiations
const app = express();
const port = 3000;

//3. Configurations


//4. Middleware
// Simple request time logger
// app.use((req, res, next) => {
//    console.log("A new request received at " + Date.now());

//    // This function call tells that more processing is
//    // required for the current request and is in the next middleware
//    //function route handler.
//next();  
// });

app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret:"secret", 
  resave: false, //we don't want to save this session
  saveUninitialized: false 
}))

app.use(express.static(path.join(__dirname,'public')));

//Simple request time logger for a specific route
app.use('/hobbies', (req, res, next) => {
  console.log('A new request received at ' + Date.now());
  next();
});

//5. Routes
//ROUTING - STRUCTURE OF A ROUTE
  //GET METHOD
// app.method(Path, handler)
// app.get('/', (req, res) => {
//   res.send('Homepage! Hello world. This is my first Node App');
// });

app.get('/about', (req, res) => { // new
  res.send('I am Martha. I love coding and I am goin to makes waves in coding. It is such a fun thing to do');
}); //method in express

app.get('/hobbies', (req, res) => {
  res.send('I love reading, swimming and my latest found one...coding');
});

app.get('/contact', (req, res) => {
  res.send('marthakwaga@gmail.com');
});



//POST METHOD
app.post('/quotes', (req, res) => {
  res.send("I can do all things through Christ who strengthens me")
})

app.post('/coding', (req, res) => {
  res.send("The best way to put your fingers to work")
})

app.post('/sunsets', (req, res) => {
  res.send("God's daily reminder that He is always with us")
})

//PUT METHOD

app.put('/services', (req, res) => {
  res.send('I can tell you more about God, a full-stack developer, graphic designer, carreer counselor, farmer, doula etc')
})

//PATH PARAMETERS
app.get('/students/:firstname', (req, res) => {
  res.send('My first name is '+ req.params.firstname)
})

//QUERY STRINGS/PARAMETERS using concatenation (+). It comes in key value pairs
app.get('/dog/:origin', (req,res)=>{
  res.send('I am looking for a dog from ' + req.params.origin + ' which is a ' + req.query.breed + ' and is ' +req.query.colour+ ' in color ')
})

//SERVING HTML FILE
app.get('/', (req,res)=>{
res.sendFile(__dirname + '/html/index.html')
})
app.get('/login', (req,res)=>{
res.sendFile(__dirname + '/html/login.html')
})
app.get('/sales', (req,res)=>{
res.sendFile(__dirname + '/html/sales.html')
})
app.post('/sales',(req,res)=>{
  console.log(req.body)
})

app.get('/dog', (req,res)=>{
  res.send('I am looking for a dog from ' + req.query.origin + ' which is a ' + req.query.breed + ' and is ' +req.query.colour+ ' in color ')
})



// This is the second last chunk of code
//Handling non-existent routes
app.use( (req, res)=> {
  res.status(404).send('Oops! Route not found.');
});

// 6. Bootstrapping Server
// Last line of code in this file
app.listen(port, () => console.log(`listening on port ${port}`));