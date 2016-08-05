var express = require('express');



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
})


app.get('/about',function(req,res){
  //res.type('text/plain');
  //res.send('About Dantegg\'s WORLD!');

  res.render('about');
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


// app.post('/process',function (req,res) {
//   console.log('Form (from querystring):'+req.query.form);
//   console.log('CSRF token (from hidden form field):'+req.body._csrf);
//   console.log('Name (from visible form field):'+req.body.name);
//   console.log('Email (from visible form field):'+ req.body.email);
//   res.redirect(303,'/thank-you');
// })


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
