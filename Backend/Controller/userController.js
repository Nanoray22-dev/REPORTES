const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, email, address, phone, age, residenceType, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      address,
      phone,
      age,
      residenceType,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, password, email, address, phone, age, residenceType, role } = req.body;
    const updateData = { username, email, address, phone, age, residenceType, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating password" });
  }
};

const sendPasswordRecoveryEmail = async (req, res) => {
  const { email } = req.body;

  const emailOptions = {
    from: "onboarding@resend.dev",
    to: email,
    subject: "Recuperación de Contraseña",
    html: '<p>Hola, has solicitado restablecer tu contraseña. Sigue este enlace para restablecerla: <a href="http://example.com/reset-password">Restablecer Contraseña</a></p>',
  };

  try {
    const response = await resend.emails.send(emailOptions);
    res.json({ message: "Email enviado exitosamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el correo electrónico." });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  changePassword,
  sendPasswordRecoveryEmail,
};
