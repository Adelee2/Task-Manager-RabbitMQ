const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'default_jwt_key')
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
