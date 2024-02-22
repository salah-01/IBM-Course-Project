const express = require("express")
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500
const app = express();
const jwt = require('jsonwebtoken');
const users = require('./model/users.json');

// Built in middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// My middlewares
app.use((req, res, next) => {
    console.log(`${req.method} : ${req.url}`);
    next();
});

app.use("/auth", require("./routes/auth"));
app.use(function (req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'salah', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                res.status(401).json({ "msg": "Unvalid token!" });
            }
            else {
                console.log(decodedToken);
                const foundUser = await users.find(({ id }) => id === decodedToken.id);
                res.locals.user = foundUser;
                req.user = decodedToken.id;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        res.status(401).json({ "msg": "Unauthorized!" });
    }
});
app.use("/user", require("./routes/user"));
app.use("/book", require("./routes/book"));



app.listen(PORT, () => { console.log(`Server is running on PORT: ${PORT}`) });