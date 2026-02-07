import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import {user} from "../../database/user.js"
import {student} from "../../database/student.js"
import {teacher} from "../../database/teacher.js"

passport.use(
  "local",
  new Strategy((username, password, cb) => {
    try {
      let foundUser = user.find(u => u.username === username);

      if (!foundUser) {
        foundUser = student.find(u => u.username === username);
      }

      if (!foundUser) {
        foundUser = teacher.find(u => u.username === username);
      }

      if (!foundUser) {
        return cb(null, false);
      }

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
  cb(null, { id: user.id, role: user.role });
});

passport.deserializeUser((payload, cb) => {
  try {
    if (payload.role === "admin") {
      return cb(null, user.find(u => u.id === payload.id));
    }
    if (payload.role === "student") {
      return cb(null, student.find(u => u.id === payload.id));
    }
    if (payload.role === "teacher") {
      return cb(null, teacher.find(u => u.id === payload.id));
    }
    return cb(null, false);
  } catch (err) {
    return cb(err);
  }
});
