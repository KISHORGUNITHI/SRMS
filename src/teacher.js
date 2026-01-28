import bcrypt from "bcrypt"
var username="teacher@gmail.com"
var password="456";
var hash=await bcrypt.hash(password,10);
export const teacher=[
    {
        id:"202501",
        username:username,
        password:hash,
        role:"teacher"
    }
]