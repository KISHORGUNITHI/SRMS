import {student} from "../../database/student.js";
export  const insertAuth=(authCredentials)=>{

  student.push({
    id:authCredentials.id,
    username:authCredentials.username,
    password:authCredentials.password,
    role:'student'
  })
}
