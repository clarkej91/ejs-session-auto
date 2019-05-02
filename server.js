require('dotenv').config()

//Dependencies
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session')
//config
const PORT = process.env.PORT
const mongoURI = process.env.MONGODB_URI

//set middleware
//allow us to use put and delete methods
app.use(methodOverride('_method'))
// parses info from our input fields into an object
app.use(express.urlencoded({extended:false}))

//config sessions
//secrets is stored in .env
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitalized: false
}))


//database config and connection
mongoose.connect(mongoURI, {useNewUrlParser: true})
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
})

//listen
app.listen(PORT, () => console.log('auth happening on port', PORT));

//Routes
app.get('/', (req, res) => {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

app.get('/app', (req, res)=>{
    if(req.session.currentUser){
        res.render('app/index.ejs')
    } else {
        res.redirect('/sessions/new');
    }
})

app.get('/app/messages', (req, res) => {
  res.render('app/messages/new.ejs')
});

//user controller
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)



//sessions controller
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
