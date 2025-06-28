import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expects "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized. Invalid Token.' });
    }
    // If token is valid, attach the user's ID to the request object
    req.user = { id: decoded.id };
    next();
  });
};