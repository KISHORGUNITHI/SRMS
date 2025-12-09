import express from 'express';
import {data} from './data.js';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
const port = 3000;
//--nav bar--//
app.get('/', (req, res) => {
    res.render('home');  //home
});
app.get('/home', (req, res) => {
    res.render('home');  //home
});
app.get('/addStudent', (req, res) => {
    res.render('add');  //add student
});
app.get('/searchStudent', (req, res) => {
    res.render('search');  //search student
    res.send("ok");
});
app.get('/displaystudents', (req, res) => {
    const students = data;
   // res.render('display', { students: data });//display students
    res.json(students);
});
//--add student--//
app.post('/addStudent', (req, res) => {
    const { id, name, cgpa } = req.body;
   
    data.push({ id, name, cgpa: parseFloat(cgpa) });
    res.render('add', { message: 'Student added successfully!' });
});
//-search student--//
app.post('/searchStudent', (req, res) => {
    const { id } = req.body;
    const student = data.find(student => student.id == id);  
    if (student) {
        //res.render('search', { student });
        res.send({student});  
    } else {
        res.render('search', { message: 'Student not found.' });
    }
    });
//--server--//
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});