const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const constant = require('./config/constant.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const layout = require('express-layout');
const path = require("path");
const app = express();
const config = require('./config/index');
const http = require('http');
const mongoose = require('mongoose');
const mwInput = require('./middleware/input');
const adminRoutes = require('./routes/admin.routes.js');
const apiRoutes  = require('./routes/api.routes.js');
const dotenv = require('dotenv').config();
const cors = require('cors');  
const corsConfig = require('./config/corsConfig');

//database connectivity
//var mongoDB = 'mongodb://localhost:27017/'+process.env.DATABASE;
// var mongoDB = 'mongodb://admin:Fresn0612@164.52.200.120:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
var mongoDB = process.env.MONGOURI;
mongoose.connect(mongoDB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**CROSS enabling config */
app.use(cors(corsConfig.corsOptions));


//view engine
app.use(cookieParser())
app.use(layout());
app.use(flash());
app.use(fileUpload({
  useTempFiles :true,
  limits: { fileSize: 50 * 1024 * 1024 },
}));

//css & js file path
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(
    session({
        secret: 'softchilli',
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 3600000 },
        store: new MongoStore({ mongooseConnection: db }),
    })
);
//middleware
app.use(mwInput());

app.use(function (req, res, next) {
  res.locals.APPCONSTANT = constant;
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.ADMININPUT = req.input('__all__');
  res.locals.COOKIE = req.cookies;
  res.locals.SESSION = req.session;
  next();
})



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//routes

adminRoutes(app);
apiRoutes(app);

var port = process.env.PORT || 3001;

app.use((error, req, res, next) => {
  console.log("Error", req);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(port, function () {
  console.log("LocalBaniya app listening on port: " + port);
})
