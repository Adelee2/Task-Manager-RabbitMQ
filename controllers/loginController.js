const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
      
      const user = await User.findOne({ username, password });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate a JWT
      const token = jwt.sign({ userId: user._id, username: user.username }, 'secret_key', {
        expiresIn: '1h', // Token expires in 1 hour
      });
  
      // Return the token to the client
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}