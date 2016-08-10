var express = require('express');
var formidable = require('formidable');



var slogans=[
  'mid or feed！',
  'noob!',
  'add blue!',
  'chick,pls!',
  'asian monkey!'
]

var resjson = [{
  "id":0,name:"harry porter","price":99.99
},{
  "id":1,name:"xiaoming","price":123.321
}]



var app = express();

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

app.use(cookieParser("secret"));
app.use(expressSession({
  'secret':'12345',
  'name':'testSession',
  'cookie':{maxAge:80000},
  'resave':false,
  'saveUninitialized':true
}))
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());


var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine("handlebars",handlebars.engine);
app.set('view engine','handlebars');


app.set('port',process.env.PORT || 3000);


app.use(express.static(__dirname+'/public'));


app.get('/',function(req,res){
  //res.type('text/plain');
  //res.send('Dantegg\'s WORLD!');
  var randomSlogans = slogans[Math.floor(Math.random()*slogans.length)];
  console.log(randomSlogans)
  res.render('home',{slogan:randomSlogans});
  res.cookie('dantegg','testcookie');
  //res.cookie('signed_dantegg','lol',{signed:true});
  var ttt = req.cookies.dantegg;
  console.log(ttt);
});


app.get('/about',function(req,res){
  //res.type('text/plain');
  //res.send('About Dantegg\'s WORLD!');

  res.render('about');
  console.log(req.cookies.signed_dantegg);
});


app.get('/thank-you',function (req,res) {
  res.render('thankyou');
});

app.get('/api/resjson',function (req,res) {
  res.json(resjson);
});



app.get('/newsletter',function (req,res) {
  res.render('newsletter',{csrf:'CSRF token goes here'});
});

var jqupload = require("jquery-file-upload-middleware");

app.get('/jqupload',function (req,res) {
  console.log(__dirname+'/public');
  res.render('jqupload');

})
// app.post('/process',function (req,res) {
//   console.log('Form (from querystring):'+req.query.form);
//   console.log('CSRF token (from hidden form field):'+req.body._csrf);
//   console.log('Name (from visible form field):'+req.body.name);
//   console.log('Email (from visible form field):'+ req.body.email);
//   res.redirect(303,'/thank-you');
// })
app.use('/upload',function (req,res,next) {
  var now = Date.now();
  jqupload.fileHandler({
    uploadDir:function () {
      return __dirname +'/public/uploads/'+now;
    },
    uploadUrl:function () {
      return '/uploads/'+now;
    }
  })(req,res,next);
});


var credentials = require('./credentials');



app.post('/process',function (req,res) {
  console.log("1"+req.accepts('json,html'));
  console.log("2"+req.xhr);
  console.log("3"+req.accepts('json,html'));
  if(req.xhr || req.accepts('json,html') ==='json'){
   // console.log(req.body);
    console.log('Form (from querystring):'+req.query.form);
    console.log('CSRF token (from hidden form field):'+req.query._csrf);
    console.log('Name (from visible form field):'+req.query.name);
    console.log('Email (from visible form field):'+ req.query.email);
    res.send({success:true});
  }else {
    res.redirect(303,'/thank-you');
  }
});


app.get('/contest/vacation-photo',function (req,res) {
  var now = new Date();
  res.render('contest/vacation-photo',{
    year:now.getFullYear(),
    month:now.getMonth()
  })
});


app.post('/contest/vacation-photo/:year/:month',function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function (err,fields,files) {
    if (err) return res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fields);
    console.log('receoived files:');
    console.log(files);
    res.redirect(303, '/thank-you');
  });
});





//page 404
app.use(function (req,res) {
  // res.type("text/plain");
  // res.status(404);
  // res.send('404-Not Found');
  res.status(404);
  res.render('404');
})

//page 500
app.use(function(err,req,res,next){
  console.error(err.stack);
  // res.type('text/plain');
  res.status(500);
  // res.send('500-Server Error');
  res.render('500')

})


app.listen(app.get('port'),function () {
  console.log('Express started on http://localhost:'+
 app.get('port')+';press Ctrl-C to terminate.');
})
