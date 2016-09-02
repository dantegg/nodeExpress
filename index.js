var express = require('express');
var formidable = require('formidable');
var nodemailer =  require('nodemailer');
var credentials = require('./credentials');

// var mailTranspot = nodemailer.createTransport('SMTP',{
//   host:'smtp.mxhichina.com',
//   secureConnection:true,
//   port:465,
//   auth:{
//     user: credentials.mailAddress.user,
//     pass: credentials.mailAddress.password
//   }
// });
//
// mailTranspot.sendMail({
//   from:credentials.sender,
//   to:credentials.sendAddress,
//   subject:'群发测试',
//   text:'nodejs&express 测试群发邮件,不要回哦~~~ from service-tec'
// },function (err) {
//   if(err) console.error('Unable to send email:'+ err);
// })


var ejs = require('ejs');
var engines = require('consolidate');

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
app.engine("html",ejs.__express);
// app.set('html',engines.ejs);
// app.set('handlebars',engines.handlebars);
app.set("view engine",'handlebars');

app.set('port',process.env.PORT || 3000);


app.use(express.static(__dirname+'/public'));
app.use(function (req,res,next) {
  res.locals.flash = req.session.flash;
  //delete req.session.flash;
  next();
})

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



app.get('/aboutus',function (req,res) {
  res.render(__dirname +'/public/html/about.html');
})

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




function NewsletterSignup(){
}
NewsletterSignup.prototype.save = function(cb){
  cb();
};

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
app.post('/newsletter', function(req, res){
  var name = req.body.name || '', email = req.body.email || '';
  // input validation
  if(!email.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was  not valid.',
    };
    return res.redirect(303, '/newsletter/archive');
  }
  new NewsletterSignup({ name: name, email: email }).save(function(err){
    if(err) {
      if(req.xhr) return res.json({ error: 'Database error.' });
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.',
      };
      return res.redirect(303, '/newsletter/archive');
    }
    if(req.xhr) return res.json({ success: true });
    req.session.flash = {
      type: 'success',
      intro: 'Thank you!',
      message: 'You have now been signed up for the newsletter.',
      username:"dantegg"
    };
    return res.redirect(303, '/newsletter/archive');
  });
});

app.get('/newsletter/archive', function(req, res){
    console.log(req.session);
    res.render('newsletter/archive');
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


app.get('/email',function (req,res) {
 console.log(req.session)
  res.render(__dirname +'/public/html/email.html',{username:'ttt'})
})

app.get('/userInfo',function (req,res) {
  return res.json({
    'username':req.session.flash.username
  })
})

app.post('/email/post',function (req,res) {
  var email = req.body.emailAddress || '';
  var emailTitle = req.body.emailTitle||''
  var emailContent = req.body.emailContent||''
  // input validation
  var emailList = [];
  emailList = email
  var emailString = emailList.join(',')
  console.log(emailString)
  console.log(credentials.sender)
  for(var i in email){
    if(!email[i].match(VALID_EMAIL_REGEX)) {

      if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    }
  }

  var mailTranspot = nodemailer.createTransport('SMTP',{
    host:'smtp.mxhichina.com',
    secureConnection:true,
    port:465,
    auth:{
      user: credentials.mailAddress.user,
      pass: credentials.mailAddress.password
    }
  });

  mailTranspot.sendMail({
    from:credentials.sender,
    to:emailString,
    subject:emailTitle,
    text:emailContent
  },function (err) {
    if(err) {
      console.error('Unable to send email:' + err);
      return (res.json({
        success: false,
        msg: '发送失败'
      }))
    }else{
      return(res.json({
        success:true,
        msg:'发送成功'
      }))
    }
  })




})


//用户登陆渲染
app.get('/login',function (req,res) {
  res.render(__dirname+'/public/html/login.html')
  //res.redirect("/email");
})

//用户登陆请求
app.post('/login',function (req,res) {
  var username = req.body.username || ''
  var userpass = req.body.userpass||''
  req.session.flash = {
    type: 'success',
    username:"dantegg"
  };
  return res.json({ success: true });
  //res.redirect(303,'/email');
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
