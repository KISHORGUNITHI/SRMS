import passport from "passport";


export const roleSelection=(req,res)=>{
    res.render('auth/role');
}

export const studentLogin = (req, res) => {
  res.render('auth/studentLogin', { message: null || req.query.message });
};
export const adminLogin = (req, res) => {
  res.render('auth/adminlogin', { message: req.query.message || null });
};
export const teacherLogin = (req, res) => {
  res.render("auth/teacherlogin", { message: req.query.message || null });
};  
export const studentLoginPost= (req,res,next)=>{
  passport.authenticate(
    "local",
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
        res.redirect(`/students/studentHome/${user.id}`);
      });
    }
  )(req, res, next);
}
export const adminLoginPost=
     passport.authenticate("local", {
        successRedirect: "/adminHome",
        failureRedirect: "/adminLogin?message=user_not_found",
      })

export const teacherLoginPost=(req,res,next)=>{
    passport.authenticate("local", (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect("/teacherLogin?message=user_not_found");
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.redirect(`/teacherhome`);
        });
      })(req, res, next);
}
export const logout=(req,res,next)=>{
    req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/role");
  });
}