const jwt = require('jsonwebtoken');
const JWT_SECRET = 'itisimportant';

const fetchuser= (req, res, next) => {
// Get the User from the JWT token and add it to req object
  const token = req.header('auth-token');
  if(!token){
    res.status(401).send("Please authenticate using valid token")
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("Please authenticate using valid token")
  }
  
}

module.exports = fetchuser;