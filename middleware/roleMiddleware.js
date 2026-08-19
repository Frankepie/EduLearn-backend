const instructorOnly = ( req,res,next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated"
    });
  }
  if (
    req.user.role !== "instructor"
  ) {
    return res.status(403).json({
      message:
        "Instructor access required"
    });
  }
  next();
};
module.exports =instructorOnly;