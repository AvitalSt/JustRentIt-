const adminUsername = process.env.ADMIN_USER
const adminPassword = process.env.ADMIN_PASS

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
        res.send({ message: 'Login successful' });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
};