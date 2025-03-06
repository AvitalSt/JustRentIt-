const jwt = require('jsonwebtoken');

const adminUsername = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASS;

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign(
      { isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
};