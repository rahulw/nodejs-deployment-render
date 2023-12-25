const userModel = require('./signup-model');
const bcrypt = require("bcryptjs");

// Add data
exports.addUser = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        let userData = new userModel(req.body);
        let result = await userData.save();
        return res.status(200).json({ result, message: 'User added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}