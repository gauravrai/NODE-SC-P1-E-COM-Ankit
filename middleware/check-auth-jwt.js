const jwt = require("jsonwebtoken");
const config = require('../config/index');
const jwtSecret = config.constant.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
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
        data:errorIn, 
        status:'error', 
        message:"Auth Failed"
    });
  }
};
