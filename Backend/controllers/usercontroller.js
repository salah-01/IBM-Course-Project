const users = require("../model/users.json");


const getAllUsers = (req, res) => {
    res.send(users);
};

const getASpecificUser = (req, res) => {
    let user = req.params.username;
    const foundUser = users.find(({ username }) => username === user);
    res.send(foundUser);
};
module.exports = { getAllUsers, getASpecificUser };