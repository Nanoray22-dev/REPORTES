const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({ username, password: hashedPassword });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { sameSite: "none", secure: true }).status(201).json({ id: createdUser._id });
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({ userId: foundUser._id, username, role: foundUser.role }, jwtSecret, {}, (err, token) => {
        if (err) {
          res.status(500).json({ message: "Error generating token" });
        } else {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({ id: foundUser._id, role: foundUser.role });
        }
      });
    } else {
      res.status(401).json({ message: "Incorrect credentials" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
};

module.exports = { register, login, logout };
