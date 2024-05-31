const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./Models/User");
const Message = require("./Models/Message");
const Report = require("./Models/Report");
const ws = require("ws");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const ObjectId = mongoose.Types.ObjectId;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conexión exitosa con la base de datos");
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(bodyParser.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://fix-oasis-residents.vercel.app"
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const server = app.listen(process.env.PORT);
const io = socketIo(server);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/", (req, res) => {
  res.json("test ok");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username, role: foundUser.role }, // Incluir el rol del usuario en el payload
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            res
              .status(500)
              .json({ message: "Error en la generación del token" });
          } else {
            res
              .cookie("token", token, { sameSite: "none", secure: true })
              .json({
                id: foundUser._id,
                role: foundUser.role,
              });
          }
        }
      );
    } else {
      res.status(401).json({ message: "Credencials incorrect" });
    }
  } else {
    res.status(404).json({ message: "User no found" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          res.status(500).json({ message: "Token Error" });
        } else {
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .status(201)
            .json({
              id: createdUser._id,
            });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Error to register the user" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.on("close", () => {
    console.log("Cliente desconectado");
  });
});

const notifyAllClients = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      console.log("size", file.data.length);
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("file saved:" + path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
});

////////////////////////////////////
// iniciando la parte del reporte //

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const baseUrl = process.env.BASE_URL;
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/report", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let reports;
    if (user.role === "admin") {
      reports = await Report.find()
        .populate("createdBy", "username")
        .populate("comments.createdBy", "username");
    } else {
      reports = await Report.find({ createdBy: userId })
        .populate("createdBy", "username")
        .populate("comments.createdBy", "username");
    }

    const reportsWithDetails = reports.map((report) => ({
      ...report.toObject(),
      createdBy: report.createdBy.username,
      image: report.image ? `${baseUrl}${report.image}` : null,
    }));

    res.json(reportsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching reports" });
  }
});

app.get("/reports", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const reports = await Report.find()
      .populate("createdBy", "username")
      .populate("comments.createdBy", "username");

    const reportsWithDetails = reports.map((report) => ({
      ...report.toObject(),
      createdBy: report.createdBy.username,
      image: report.image ? `${baseUrl}${report.image}` : null,
    }));

    res.json(reportsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching reports" });
  }
});

app.get("/report/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    console.error("Error fetching report details:", error);
    res.status(500).json({ error: "Error fetching report details" });
  }
});

app.post("/report", upload.array("image"), async (req, res) => {
  try {
    const { title, description, state, incidentDate } = req.body;
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map((file) => file.path);
    }
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, jwtSecret);
    const userId = decodedToken.userId;

    const newReport = await Report.create({
      title,
      description,
      state,
      images: imagePaths, // Asegúrate de que el campo sea images y no image
      incidentDate,
      createdBy: userId,
      createdAt: new Date(),
    });

    const reportWithDetails = {
      ...newReport.toObject(),
      createdBy: (await User.findById(userId)).username,
      images: imagePaths.map((path) => `${baseUrl}${path}`), // Asegúrate de manejar correctamente las URLs de las imágenes
    };

    notifyAllClients({ type: "new-report", data: reportWithDetails });

    res.status(201).json(reportWithDetails);
  } catch (error) {
    console.error("Error creating report:", error); // Mejora el log de errores

    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }

    res.status(500).json({ error: "Error creating report" });
  }
});

app.delete("/report/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    await Report.findByIdAndDelete(reportId);
    notifyAllClients({ type: "delete-report", reportId });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Error deleting report" });
  }
});

app.put("/report/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const { title, description, state, incidentDate } = req.body;

    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "User is not authorized to update report state" });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { title, description, state, incidentDate },
      { new: true }
    );

    const reportWithDetails = {
      ...updatedReport.toObject(),
      createdBy: (await User.findById(updatedReport.createdBy)).username,
      image: updatedReport.image ? `${baseUrl}${updatedReport.image}` : null,
    };

    notifyAllClients({ type: "update-report", reportWithDetails });

    res.status(200).json(reportWithDetails);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Error updating report" });
  }
});

app.post("/assign-report/:reportId", async (req, res) => {
  try {
    const { userId } = req.body;
    const reportId = req.params.reportId;

    // Asignar el informe al usuario especificado
    await Report.findByIdAndUpdate(reportId, { assignedTo: userId });

    // Enviar notificación al usuario asignado
    await sendNotificationToUser(reportId, userId);

    res.status(200).json({ message: "Informe asignado exitosamente" });
  } catch (error) {
    console.error("Error asignando informe:", error);
    res.status(500).json({ error: "Error asignando informe" });
  }
});

app.put("/mark-report-reviewed/:reportId", async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Actualizar el estado del informe como revisado
    await Report.findByIdAndUpdate(reportId, { state: "REVIEWED" });

    res.status(200).json({ message: "Informe marcado como revisado" });
  } catch (error) {
    console.error("Error marcando informe como revisado:", error);
    res.status(500).json({ error: "Error marcando informe como revisado" });
  }
});

app.post("/report/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    const reportId = req.params.id;

    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const user = await User.findById(userId, "username");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = {
      text,
      createdBy: userId,
      createdAt: new Date(),
    };

    report.comments.push(comment);
    await report.save();

    const newComment = report.comments[report.comments.length - 1];
    newComment.createdBy = user;

    notifyAllClients({
      type: "new-comment",
      data: { reportId, comment: newComment },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Error adding comment" });
  }
});

app.get("/report/:id/comments", async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId).populate(
      "comments.createdBy",
      "username"
    );
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json(report.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

app.put("/report/:reportId/comment/:commentId", async (req, res) => {
  try {
    const { text } = req.body;
    const { reportId, commentId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const token = req.cookies?.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (comment.createdBy.toString() !== decodedToken.userId) {
      return res.status(403).json({ error: "User not authorized" });
    }

    comment.text = text;
    await report.save();

    const user = await User.findById(decodedToken.userId, "username");
    comment.createdBy = user;

    io.to(reportId).emit("updateComment", comment); // Emitir evento a través de WebSocket

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Error updating comment" });
  }
});

app.delete("/report/:reportId/comment/:commentId", async (req, res) => {
  try {
    const { reportId, commentId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const commentIndex = report.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    report.comments.splice(commentIndex, 1);
    await report.save();

    io.to(reportId).emit("deleteComment", commentId); // Emitir evento a través de WebSocket

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
});

app.get("/user/:userId/reports", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const reports = await Report.find({ createdBy: userId });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching user reports:", error);
    res.status(500).json({ error: "Error fetching user reports" });
  }
});

async function assignReportAndNotify(reportId, userId) {
  try {
    // Asignar el informe al usuario especificado
    await Report.findByIdAndUpdate(reportId, { assignedTo: userId });

    // Enviar notificación al usuario asignado
    await sendNotificationToUser(reportId, userId);

    return { message: "Informe asignado exitosamente" };
  } catch (error) {
    console.error("Error asignando informe:", error);
    throw new Error("Error asignando informe");
  }
}

/////////////////////////////////////////////////////////////////
// iniciando la parte del Usuario (residente o administrador) //

app.get("/users", async (req, res) => {
  try {
    // Obtener el usuario desde el token de autenticación
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Verificar el rol del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Si el usuario es administrador, devuelve todos los usuarios
    if (user.role === "admin") {
      const users = await User.find();
      return res.json(users);
    } else {
      // Si el usuario no es administrador, devuelve solo su propio usuario
      return res.json([user]);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, password, email, address, phone, age, residenceType } =
      req.body;
    const newUser = await User.create({
      username,
      password,
      email,
      address,
      phone,
      age,
      residenceType,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.put("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      username,
      password,
      email,
      address,
      phone,
      age,
      residenceType,
      role,
    } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, password, email, address, phone, age, residenceType, role },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const userData = await getUserDataFromRequest(req);
    const userId = userData.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

app.post("/change-password", authenticateJWT, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, bcryptSalt);

    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Error updating password" });
  }
});

async function getUserDataFromRequest(req) {
  return new Promise((resolve) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
          console.error("Error verifying token:", err);
          resolve(null);
        } else {
          resolve(userData);
        }
      });
    } else {
      resolve(null);
    }
  });
}

const storages = multer.memoryStorage();
const uploads = multer({ storages });

app.put("/user", uploads.single("profileImage"), async (req, res) => {
  try {
    const userData = await getUserDataFromRequest(req);
    const userId = userData.userId;

    // Obtener los datos del usuario a actualizar del cuerpo de la solicitud
    const { username, email, address, phone, age, residenceType, role } =
      req.body;

    // Actualizar el usuario autenticado
    const updatedUserData = {
      username,
      email,
      address,
      phone,
      age,
      residenceType,
      role,
    };

    // Si se cargó una imagen de perfil, actualizarla también
    if (req.file) {
      updatedUserData.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.post("/api/sendPasswordRecoveryEmail", async (req, res) => {
  const { email } = req.body;

  //  las opciones del correo electrónico
  const emailOptions = {
    from: "onboarding@resend.dev",
    to: email,
    subject: "Recuperación de Contraseña",
    html: '<p>Hola, has solicitado restablecer tu contraseña. Sigue este enlace para restablecerla: <a href="http://example.com/reset-password">Restablecer Contraseña</a></p>',
  };

  // Envía el correo electrónico
  try {
    const response = await resend.emails.send(emailOptions);
    console.log("Email sent successfully:", response);
    res.json({ message: "Email enviado exitosamente." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error al enviar el correo electrónico." });
  }
});

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/user/me", authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password"); // Excluir el campo de la contraseña
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user data:", error);
    res.status(500).json({ error: "Error fetching current user data" });
  }
});

// Mensaje reciente //

app.get("/recent-messages", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId; // Ahora puedes acceder a req.user
    const recentMessages = await Message.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(recentMessages);
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    res.status(500).json({ error: "Error fetching recent messages" });
  }
});

async function authenticateJWT(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decodedToken = jwt.verify(token, jwtSecret);
      req.user = decodedToken;
      next();
    } else {
      throw new Error("Token not provided");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}
