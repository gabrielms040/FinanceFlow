const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Token não fornecido');

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS);   
    req.userId = decoded.userId;
    req.userName = decoded.name;

    next();
  } catch (err) {
  
    return res.status(401).send('Token inválido ou expirado');
  }
}

module.exports = verifyToken;
