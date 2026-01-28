import express from 'express';
import { data } from './data.js';
import { user } from './user.js';
import { student } from './student.js';
import { teacher } from './teacher.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import env from 'dotenv';

const port = 3000;
const saltRounds = 10;
const host='localhost';


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


//--passport strategy admin & teacher--//
passport.use(
  "local",
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
//--passsport stratagey for Student--//
passport.use("student",
  
  new Strategy((username,password,cb)=>{


    const foundStudent=student.find(u=>u.username===username)
    console.log(foundStudent)
    if(!foundStudent){return cb(null,false);}
    bcrypt.compare(password,foundStudent.password,(err,valid)=>{
      if(!valid){return cb(null,false);}

      return cb(null,foundStudent)
    })
  })
)
//passport strategy for teacher//
passport.use("teacher",
  new Strategy((username,password,cb)=>{

  })
)

passport.serializeUser((user, cb) => {
  cb(null,{ id:user.id,role:user.role});
});

passport.deserializeUser((payload, cb) => {
  try {
    if (payload.role === "admin") {
      const foundUser = user.find(u => u.id === payload.id);
      return cb(null, foundUser);
    }

    if (payload.role === "student") {
      const foundStudent = student.find(u => u.id === payload.id);
      return cb(null, foundStudent);
    }

    cb(null, false);
  } catch (err) {
    cb(err);
  }
});
//--autherization routes--//
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/role?message=not_authenticated');
}
//--RBAC MIDDLEWARE--//
function RBAC(allowedROles){
    return (req,res,next)=>{
        var role=req.user.role;
        var allowed=allowedROles.find(r=>r===role);
      if(allowed){
              next();
               }
      else{
           res.status("403").send("no access");
          }
       }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--role selecting--//
app.get('/', (req, res) => {
  res.render('auth/role');
});
//--role selecting--//
app.get('/role', (req, res) => {
  res.render('auth/role');
});
//--student login--//
app.get('/studentLogin',(req,res)=>{
  res.render('auth/studentLogin',{
    message:null || req.query.message
  });
})

//--admin login--//
app.get('/adminLogin', (req, res) => {
  res.render('auth/adminlogin',{
    message:req.query.message || null
  });
});
//--logout--//
app.get('/logout',isAuthenticated,(req,res)=>{
 
  req.logout((err)=>{
    if(err){
      
      return next(err);
    }
   res.redirect("/role");
  });
 
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--regester post--//
app.get('/register', (req, res) => {
  res.render('auth/register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = user.find(u => u.username === username);
  if (existingUser) return res.redirect('/adminLogin?message=user_already_exists');

  const hashed_password = await bcrypt.hash(password, saltRounds);

  user.push({
    id: user.length + 1,
    username,
    password: hashed_password,
  });

  res.redirect('/role');
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//admin login post//
app.post(
  "/adminLogin",
  passport.authenticate("local", {
    successRedirect: "/adminHome",
    failureRedirect: "/adminLogin?message=user_not_found",
  })
);
//studentLogin//
app.post("/studentLogin", (req, res, next) => {

  const middleware = passport.authenticate(
    "student",
    (err, user, info) => {

      if (err) {
        return next(err);
      }

      if (!user) {
        return res.redirect("/studentLogin?message=invalid_credentials");
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect(`/studentHome/${user.id}`);
      });

    }
  );

  middleware(req, res, next);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--student home--//
app.get(
  "/studentHome/:id",
  isAuthenticated,
  RBAC(["student"]),
  (req, res) => {
    if (req.user.id !== req.params.id) {
      return res.status(403).send("not your profile");
    }

    const student = data.find(u => u.id === req.params.id);

    res.render("home/studenthome", {
      student:student
    });
  }
);


//--admin home--//
app.get('/adminhome', isAuthenticated, (req, res) => {
  res.render('home/admin_home');
});
//--add student--//
app.get('/addStudent', isAuthenticated, RBAC(["admin","teacher"]),csrfProtection, (req, res) => {
    res.render('app/add', {
      csrfToken: req.csrfToken(),
    });
});
//--search student--//
app.get('/searchStudent', isAuthenticated,RBAC(["admin","teacher"]),csrfProtection ,(req, res) => {
  console.log(req.query.message)
  res.render('app/search', { 
    student: null,
    message:req.query.message || null,
    csrfToken:req.csrfToken(),
    message:req.query.message
  });
});
//--selete student--//
app.get('/deleteStudent',isAuthenticated,RBAC(["admin"]),csrfProtection,(req,res)=>{
  const message=req.query.message;
  console.log(message);
  res.render('app/delete',{student:null,
    message:message || null,
    csrfToken:req.csrfToken()
  });
})

//--add student post--//
app.post('/addStudent',isAuthenticated,RBAC(["admin","teacher"]) ,csrfProtection, (req, res) => {
  const { id, name, age, branch, year, phone } = req.body;

  data.push({
    id,
    name,
    age: parseInt(age),
    branch,
    year: parseInt(year),
    phone: parseInt(phone),
  });

  res.json({ message: 'Student added successfully!' });
});

//--search studen postt--//
app.post('/searchStudent',isAuthenticated,RBAC(["admin","teacher"]) ,csrfProtection, (req, res) => {
  const { search_id } = req.body;
  const student = data.find(student => student.id == search_id);
  console.log(req.body.identifier);
  if(req.body.identifier=='true'){
    if(student){
     return res.render('app/delete',{
      student:student||null,
      message:null,
      csrfToken:req.csrfToken()
     });

    }
   else{
    res.redirect('/deleteStudent?message=student_not_found');
   }
  }
  else{
if (student) {
   return  res.render('app/search', {  
      student:student||null,
      csrfToken:req.csrfToken() 
    });
  }else{
    res.redirect('/searchStudent?message=student_not_found');
  }
  }
  
});

//--delete student post--//
app.post('/deleteStudent/:search_id',isAuthenticated,RBAC(["teacher"]) ,csrfProtection,(req,res)=>{
    const id=(req.params.search_id);
    const index = data.findIndex(element => element.id === req.params.search_id);
if (index !== -1) {
  data.splice(index, 1);
}
  res.redirect('/deleteStudent?message=deleted');
})
//--display students--//
app.get('/displaystudents',isAuthenticated,RBAC(["admin","teacher"]) , (req, res) => {
  res.render('app/display.ejs', {
    students: data,
  });
});

//--server--//
app.listen(port,host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
