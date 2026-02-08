import session from "express-session";
import dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env" });

console.log("SESSION_SECRET =", process.env.SESSION_SECRET);

export const sessionmiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
