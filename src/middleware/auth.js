//--autherization middleware--//
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/role?message=not_authenticated');
}
