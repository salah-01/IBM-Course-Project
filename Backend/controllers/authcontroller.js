const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const users = require('../model/users.json');
const fs = require('fs');

// Global
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ "id": id }, 'salah', {
        expiresIn: maxAge
    });
};


const register = async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ "message": "Username and password are required" });
    }
    try {
        // Store the user info
        console.log(`...${"Good."}`);
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        // Get last id
        const id = await users[await users.length - 1].id + 1;
        if (!id) id = 1;
        const result = { id, username, password };
        console.log(result);
        const originalArray = users;
        const unSortedArray = [...originalArray, result];
        const sortedArray = await unSortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
        await fs.writeFile('model/users.json', JSON.stringify(sortedArray, null, 2), err => {
            if (err) console.log(err);
            else console.log('The file is successfully written!');
        });

        // Create a token for that user
        const usr = username;
        const foundUser = await users.find(({ username }) => username === usr);
        const token = createToken(foundUser.id);

        // Reponse with the cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ "msg": "Welcome!" });

    } catch (err) {
        console.log("Error : " + err.message);
        res.status(404).json({ "msg": "Error!" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const usr = username;
    if (username && password) {
        const foundUser = await users.find(({ username }) => username === usr);
        // Compare hashed passwords
        const result = await bcrypt.compare(password, foundUser.password)
        if (result && foundUser) {
            // Create jwt
            const token = createToken(foundUser.id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            // Response
            res.status(200).json({ "msg": "Welcome!" });
        } else {
            res.status(401).json({ "msg": "Enter the correct username and password" });
        }
    } else {
        res.Status(401).json({ "msg": "Enter username and password" });
    };
};

const logout = (req, res) => {
    res.cookie("jwt", '', { maxAge: 1 });
    res.status(200).json({ "msg": "Loged out successfully" })
};
module.exports = { register, login, logout };