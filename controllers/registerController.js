const usersDB = {
    user:require('../model/user.json'),
    setUser : function(user) {
        this.user = user;
    },
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const addNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = usersDB.user.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        usersDB.setUser([...usersDB.user, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '../model/user.json'),
            JSON.stringify(usersDB.user)
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { addNewUser };