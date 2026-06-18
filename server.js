import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());
app.use(helmet());

app.use(morgan("dev"));
app.use(loggerMiddleware)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(fileUpload());

app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

app.set("view engine", "ejs");

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too Many Requests"
    }
});
app.use(limiter);

app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/public/index.html");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        title: "Student Dashboard"
    });
});

io.on("connection", (socket) => {
    console.log("User Connected");
    socket.on("message", (msg) => {
        console.log(msg);
        io.emit("message", msg);
    });
    socket.on("disconnected", () => {
        console.log("User Disconnected");
    });
});

app.use(errorMiddleware);
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
