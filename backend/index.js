import express from "express"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv";
dotenv.config(); // Moved to the top

import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import liveRouter from "./routes/liveRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import adminRouter from "./routes/adminRoute.js";

let port = process.env.PORT || 8000
let app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5174", "http://localhost:5173", "http://localhost:8000"],
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5174", "http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true
}))
app.use("/api/auth", authRouter)
app.use("/api/live", liveRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)
app.use("/api/admin", adminRouter)


app.get("/" , (req,res)=>{
    res.send("Hello From Server")
})

// Socket.io event handlers for live sessions
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join live room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', socket.id);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // WebRTC signaling
    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', { offer: data.offer, sender: socket.id });
    });

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', { answer: data.answer, sender: socket.id });
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', { candidate: data.candidate, sender: socket.id });
    });

    // Chat messages
    socket.on('send-message', (data) => {
        socket.to(data.roomId).emit('receive-message', { message: data.message, sender: socket.id, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(port , ()=>{
    console.log("Server Started")
    connectDb()
})
 
