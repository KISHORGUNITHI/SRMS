
import * as service from "./student.services.js"

export const renderhome=(req,res)=>{
    if (req.user.id !== req.params.id) {
      return res.status(403).send("not your profile");
    }
    const student=service.search(req.params.id);
     res.render("home/studenthome", { student: student });
}

export const addStudent=(req,res)=>{
     res.render('app/add', {
      csrfToken: req.csrfToken(),
    });
}

export const searchStudent=(req,res)=>{
 console.log(req.query.message);
    res.render('app/search', {
      student: null,
      message: req.query.message || null,
      csrfToken: req.csrfToken(),
      message: req.query.message
    });
}

export const deleteStudent=(req,res)=>{
    const message = req.query.message;
    console.log(message);
    res.render('app/delete', {
      student: null,
      message: message || null,
      csrfToken: req.csrfToken()
    });
}

export const displayStudents=(req,res)=>{
    const students=service.getdata();
   res.render('app/display.ejs', {
         students: students,
       });
}

export const postaddstudent=(req, res,next) => {
    const {id, name, age, branch, year, phone}=req.body;
     service.postaddstudent({
        id,
        name, 
        age, 
        branch,
        year,
        phone})
    res.json({ message: 'Student added successfully!' });
  }

  export const postSearchStudent=(req,res,next)=>{
    const { search_id } = req.body;
      const student = service.search(search_id);
      console.log(req.body.identifier);
      if (req.body.identifier == 'true') {
        if (student) {
          return res.render('app/delete', {
            student: student || null,
            message: null,
            csrfToken: req.csrfToken()
          });
        } else {
          res.redirect('/deleteStudent?message=student_not_found');
        }
      } else {
        if (student) {
          return res.render('app/search', {
            student: student || null,
            csrfToken: req.csrfToken()
          });
        } else {
          res.redirect('/searchStudent?message=student_not_found');
        }
      }
  }
  

  export const postdeletestudent=(req,res,next)=>{
    const id = (req.params.search_id);
   service.deleteId(id);
    res.redirect('/deleteStudent?message=deleted');
  }
      