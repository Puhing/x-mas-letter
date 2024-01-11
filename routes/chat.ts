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
        // console.log(rooms,'이거방정보', rooms.length);
        console.log(socket.adapter.rooms, "방정보와 유저수");
        cb(`Joined ${room} room`)
        socket.emit('updateRoomList', room); //해당 소켓에게만 업데이트된 방 목록을 전송
    })
})

export default router;
