const jwt = require("jsonwebtoken");
const secret = "E-commerce";

exports.isLoggedIn = async (req, res, next) => {
    try {
        // check if auth header exists
        if (req.headers.authentication) {
          // parse token from header
          const token = req.headers.authentication.split(" ")[1]; //split the header and get the token
          if (token) {
            const payload = await jwt.verify(token, secret);
            if (payload) {
              // store user data in request object
              req.user = payload;
              next();
            } else {
              res.status(401).json({ error: "token verification failed" });
            }
          } else {
            res.status(401).json({ error: "malformed auth header" });
          }
        } else {
          res.status(401).json({ error: "No authorization header" });
        }
      } catch (error) {
        res.status(401).json({ error });
      }
}

exports.isSuperadmin = async (req, res, next) => {
  // get user info from above function
  if (req.user?.role === "superadmin") {
      next();
  }
  else {
    return res.status(401).json({ error: "Unauthorized!" });
  }
}