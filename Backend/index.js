const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Message = require("./models/Message");
const ws = require("ws");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Report = require("./Models/Report");

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
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

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

app.get("/test", (req, res) => {
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

// app.get("/profile", (req, res) => {
//   const token = req.cookies?.token;
//   if (token) {
//     jwt.verify(token, jwtSecret, {}, (err, userData) => {
//       if (err) throw err;
//       res.json(userData);
//     });
//   } else {
//     res.status(401).json("no token");
//   }
// });

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
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});


app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
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
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

const server = app.listen(4040);

const wss = new ws.WebSocketServer({ server });
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
      console.log("dead");
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
      console.log("created message");
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
const baseUrl = "http://localhost:4040/";

// app.get("/report", async (req, res) => {
//   try {
//     const reports = await Report.find().populate("createdBy", "username"); 
//     const reportsWithUsername = reports.map(report => ({
//       ...report.toObject(),
//       createdBy: report.createdBy.username, // Reemplaza el ID del usuario con su nombre de usuario
//       image: report.image ? `${baseUrl}${report.image}` : null
//     }));
//     res.json(reportsWithUsername);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error fetching reports" });
//   }
// });

app.get("/report", async (req, res) => {
  try {
    // Obtén el usuario desde el token de autenticación
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Verifica el rol del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Si el usuario es administrador, devuelve todos los reportes
    if (user.role === "admin") {
      const reports = await Report.find().populate("createdBy", "username");
      const reportsWithUsername = reports.map(report => ({
        ...report.toObject(),
        createdBy: report.createdBy.username,
        image: report.image ? `${baseUrl}${report.image}` : null
      }));
      return res.json(reportsWithUsername);
    } else {
      // Si el usuario no es administrador, devuelve solo los reportes creados por ese usuario
      const reports = await Report.find({ createdBy: userId }).populate("createdBy", "username");
      const reportsWithUsername = reports.map(report => ({
        ...report.toObject(),
        createdBy: report.createdBy.username,
        image: report.image ? `${baseUrl}${report.image}` : null
      }));
      return res.json(reportsWithUsername);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching reports" });
  }
});


app.post("/report", upload.single("image"), async (req, res) => {
  try {
    const { title, description, state,incidentDate } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }

    // Obtener el usuario desde el token de autenticación
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Crear el reporte con el usuario y la fecha de creación
    const newReport = await Report.create({
      title,
      description,
      state,
      image: imagePath,
      incidentDate,
      createdBy: userId, // Establecer el usuario como creador del reporte
      createdAt: new Date(), // Establecer la fecha de creación del reporte
    });

    // Enviar la respuesta solo una vez al final del bloque try
    res.status(201).json(newReport);
  } catch (error) {
    console.error(error);
    // Si ocurrió un error, eliminar la imagen subida (si existe)
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Error creating report" });
  }
});

app.delete("/report/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    await Report.findByIdAndDelete(reportId);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Error deleting report" });
  }
});

// app.put("/report/:id", async (req, res) => {
//   try {
//     const reportId = req.params.id;
//     const { title, description, state, incidentDate } = req.body;
//     const updatedReport = await Report.findByIdAndUpdate(
//       reportId,
//       { title, description, state, incidentDate },
//       { new: true }
//     );
//     res.status(200).json(updatedReport);
//   } catch (error) {
//     console.error("Error updating report:", error);
//     res.status(500).json({ error: "Error updating report" });
//   }
// });

app.put("/report/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const { title, description, state, incidentDate } = req.body;

    // Verificar el rol del usuario
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    // Verificar si el usuario es administrador
    if (user.role !== "admin") {
      // Si no es administrador, enviar un error
      return res.status(403).json({ error: "User is not authorized to update report state" });
    }

    // Si el usuario es administrador, actualizar el reporte
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { title, description, state, incidentDate },
      { new: true }
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Error updating report" });
  }
});





/////////////////////////////////////////////////////////////////
// iniciando la parte del Usuario (residente o administrador) //


// const userRouter = require('./UserRouter.js');
// app.use('/users', userRouter);


// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

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
    const { username, password, email, address, phone, age, residenceType } = req.body;
    const newUser = await User.create({ username, password, email, address, phone, age, residenceType, role });
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
    const { username, password, email, address, phone, age, residenceType,role } = req.body;
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

// Mensaje reciente //

app.get("/recent-messages", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId; // Ahora puedes acceder a req.user
    const recentMessages = await Message.find({ recipient: userId }).sort({ createdAt: -1 }).limit(5);
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
      req.user = decodedToken; // Agrega la información del usuario al objeto req
      next();
    } else {
      throw new Error("Token not provided");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}


