var express = require('express');


var slogans=[
  'mid or feed！',
  'noob!',
  'add blue!',
  'chick,pls!',
  'asian monkey!'
]

var app = express();

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
})

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
