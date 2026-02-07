import * as repository from "./auth.repository.js";
import bcrypt from "bcrypt";
export const createCredentials=async({phone,id})=>{
var username;
var password;
  username=String(phone)
  password=await bcrypt.hash(id,10)
  repository.insertAuth({id,username,password});
};