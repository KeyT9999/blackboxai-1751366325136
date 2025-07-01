const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password and role are required' });
    }
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const user = new User({ username, role });
    await user.setPassword(password);
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};
