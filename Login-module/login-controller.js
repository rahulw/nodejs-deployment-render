const userModel = require('../Signup-module/signup-model');
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const secret = "E-commerce";
const refreshSecret = "E-commerce-refresh";

// login
exports.login = async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });
        if (user) {
            //check if password matches
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                // sign token and send it in response
                const token = jwt.sign({ email: user.email, role: user.role }, secret, { expiresIn: '10m' });
                const refreshToken = jwt.sign({ email: user.email, role: user.role }, refreshSecret, { expiresIn: '1d' });
                const userInfo = {
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
                res.status(200).json({ token, refreshToken, userInfo })
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        }
        else if (!req.body.username && !req.body.password) {
            res.status(400).json({ error: "Required" });
        }
        else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });
        if (user) {
            if (req.body?.refreshToken) {
                // Destructuring refreshToken from cookie
                const refreshToken = req.body.refreshToken;

                // Verifying refresh token
                const validRefreshToken = jwt.verify(refreshToken, refreshSecret)
                    if(validRefreshToken) {
                        const token = jwt.sign({ email: user.email, role: user.role }, secret, { expiresIn: '10m' });
                        res.status(200).json({ token })
                    } else {
                        res.status(401).json({ message: 'Unauthorized' });
                    }
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        }
        else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}