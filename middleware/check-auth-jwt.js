const jwt = require("jsonwebtoken");
const messageController = require('../controllers/messageController');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    let errorIn = {
        message: "Auth Failed",
        type: "AUTH_ERR",
        code: 2001,
        messages: {
          title:"Error: Invalid Auth Token",
          description: "Invalid Auth Token: "+error}
    }
    return res.status(200).json({
        error:errorIn, 
        status:'failed', 
        message:"Auth Failed"
    });
  }
};
