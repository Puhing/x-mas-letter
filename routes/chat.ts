import express from 'express';
import { Socket } from "socket.io";

const router = express.Router();
const app = express();
const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:3033"],
    },
});

router.get("/", (req, res) => {
    res.render('chat', {
        title: '채팅방',
    });
})

io.on("connection", socket => {
    console.log(socket.id);
    console.log("이거 아이디");
    socket.on("send-message", (message) => {
        socket.broadcast.emit("receive-message", message)
        console.log(message)
    })
})

export default router;
