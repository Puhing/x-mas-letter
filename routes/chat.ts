import express from 'express';
import { createServer } from "http";
import Server from "socket.io";
import { Socket } from "socket.io";

const httpServer = createServer();

const router = express.Router();
const app = express();
const io = new Server(httpServer.listen(3000), {
    cors: {
        origin: ["http://localhost:3033"],
    },
});

let rooms = [];

router.get("/", (req, res) => {
    res.render('chat', {
        title: '채팅방',
    });
})

io.on("connection", socket => {
    console.log(socket.id);
    console.log("이거 아이디");
    socket.on("send-message", (message, room) => {
        if (room === ''){
            socket.broadcast.emit("receive-message", message)
            console.log(message)
        } else {
            socket.to(room).emit("receive-message", message)
            console.log(message)
        }
    })
    socket.on("join-room", (room, cb) =>{
        socket.join(room)
        rooms.push(room) //rooms = []; 리스트에 룸 추가
        io.emit('updateRoomList', room) // 클라이언트에게 업데이트된 방 목록을 전송
        console.log(rooms);
        cb(`Joined ${room} room`)
    })
})

export default router;
