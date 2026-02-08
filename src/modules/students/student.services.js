import * as repository from "./student.repository.js";
import { createCredentials } from "../auth/auth.service.js";
export const postaddstudent=async(student)=>{
       repository.insert(student);
    await createCredentials({phone: student.phone,id: student.id})
}
export const getdata=()=>{
    return repository.getdata();
}

export  const search=(id)=>{
    return repository.search(id);
}

export const deleteId=(id)=>{
  repository.deleteId(id);
}