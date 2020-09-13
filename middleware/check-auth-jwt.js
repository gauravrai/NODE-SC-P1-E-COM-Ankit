const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, "secret");
    req.userData = decoded;
    next();
  } catch (error) {
    let errorIn = {
        message: "Auth Failed",
        type: "AUTH_ERR",
        code: 401,
        messages: {
          title:"Error: Invalid Auth Token",
          description: "Invalid Auth Token: "+error}
    }
    return res.status(401).json({
        error:errorIn, 
        status:'failed', 
        message:"Auth Failed"
    });
  }
};
