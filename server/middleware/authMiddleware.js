import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  
  // Check if the authorization header exists and is in the correct format
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user information to the request object
      // This makes it available in subsequent protected routes
      req.user = decoded; 

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Respond with 401 Unauthorized if the token is invalid or expired
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the header at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};