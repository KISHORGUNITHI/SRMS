import express from 'express';
import { data } from './data.js';
import { user } from './user.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import env from 'dotenv';

const port = 3000;
const host = '10.1.184.23';
const saltRounds = 10;

env.config();

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const csrfProtection = csrf({ cookie: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));


//--session initialization--//
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//--passport initialization--//
app.use(passport.initialize());
app.use(passport.session());


//--passport strategy--//
passport.use(
  "lol",
  new Strategy((username, password, cb) => {
    try {
      const foundUser = user.find(u => u.username === username);
      console.log(foundUser);
      if (!foundUser) return cb(null, false);

      bcrypt.compare(password, foundUser.password, (err, valid) => {
        if (err) return cb(err);
        if (!valid) return cb(null, false);
        return cb(null, foundUser);
      });
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  try {
    const foundUser = user.find(u => u.id === id);
    cb(null, foundUser);
  } catch (err) {
    cb(err);
  }
});
//--autherization routes--//
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login?message=not_authenticated');
}

////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.render('auth/home');
});

app.get('/homeauth', (req, res) => {
  res.render('auth/home');
});

app.get('/login', (req, res) => {
  res.render('auth/login',{
    message:req.query.message || null
  });
});

app.get('/logout',isAuthenticated,(req,res)=>{
 
  req.logout((err)=>{
    if(err){
      
      return next(err);
    }
   res.redirect("/login");
  });
 
})
app.get('/register', (req, res) => {
  res.render('auth/register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = user.find(u => u.username === username);
  if (existingUser) return res.redirect('/login?message=user_already_exists');

  const hashed_password = await bcrypt.hash(password, saltRounds);

  user.push({
    id: user.length + 1,
    username,
    password: hashed_password,
  });

  res.redirect('/login');
});

app.post(
  "/login",
  passport.authenticate("lol", {
    successRedirect: "/home",
    failureRedirect: "/login?message=user_not_found",
  })
);

//////////////////////////////////////////////////////////////////////////

app.get('/home', isAuthenticated, (req, res) => {
  res.render('app/home');
});

app.get('/addStudent', isAuthenticated, csrfProtection, (req, res) => {
    res.render('app/add', {
      csrfToken: req.csrfToken(),
    });
});

app.get('/searchStudent', isAuthenticated, (req, res) => {
  res.render('app/search', { student: null});
});

app.get('/deleteStudent',isAuthenticated,(req,res)=>{
  const message=req.query.message;
  res.render('app/delete',{student:"",
    message:message || null,
    
  });
})

//--add student--//
app.post('/addStudent',isAuthenticated, csrfProtection, (req, res) => {
  const { id, name, age, branch, year, phone } = req.body;

  data.push({
    id,
    name,
    age: parseInt(age),
    branch,
    year: parseInt(year),
    phone: parseInt(phone),
  });

  res.render('',{ message: 'Student added successfully!' });
});

//--search student--//
app.post('/searchStudent',isAuthenticated, (req, res) => {
  const { search_id } = req.body;
  const student = data.find(student => student.id == search_id);
  console.log(req.body.identifier);
  if(req.body.identifier=='true'){
    if(student){
     return res.render('app/delete',{student});
    }
   
  }
  else{
if (student) {
   return  res.render('app/search', { student });
  }
  }
  
});

//--delete student--//
app.post('/deleteStudent/:search_id',isAuthenticated,(req,res)=>{
    const id=(req.params.search_id);
    const index = data.findIndex(element => element.id === req.params.search_id);
if (index !== -1) {
  data.splice(index, 1);
}
  res.redirect('/deleteStudent?message=deleted');
})
//--display students--//
app.get('/displaystudents',isAuthenticated, (req, res) => {
  res.render('app/display.ejs', {
    students: data,
  });
});

//--server--//
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
