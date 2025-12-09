import express from 'express';
import {data} from './data.js';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
    res.render('search',{ student:"" });  //search student
});
app.get('/displaystudents', (req, res) => {
    const students = data;
    res.render('display', { students: data });//display students
    
});
//--add student--//
app.post('/addStudent', (req, res) => {
    const { id, name, age, branch, year, phone } = req.body;
   
    data.push({ id, name, age:parseInt(age) , branch, year:parseInt(year) , phone: parseInt(phone) });
    res.json({ message: 'Student added successfully!' });
    console.log(id, name, age, branch, year, phone);
});
//--search student--//
app.post('/search', (req, res) => {
    const { id } = req.body;
   
    const student = data.find(student => student.id == id);  
    if (student) {
        res.render('search', { student });
    }

}); 
//--server--//
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});