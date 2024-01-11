import express from 'express';
import { createServer } from "http";
import Server from "socket.io";
import { Socket } from "socket.io";
import fs from 'fs';
import bodyParser from 'body-parser';

//
import MySQL from '../MySQL';
import { upload } from '../util/fileupload';

const httpServer = createServer();
const router = express.Router();
const app = express();
const read_db = MySQL.read();
const db = MySQL.write();
const io = new Server(httpServer.listen(3000), {
    cors: {
        origin: ["http://localhost:3033"],
    },
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// let rooms = [];
// let ids = [];
let userNum = 0;

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
        // rooms.push(room) //rooms = []; 리스트에 룸 추가
        // console.log(rooms,'이거방정보', rooms.length);
        let specificRoom = socket.adapter.rooms[room];
        userNum = specificRoom.length;

        console.log(socket.adapter.rooms, "방정보와 유저수", specificRoom.length);

        if (userNum > 10){
            socket.leave(room)
            console.log ('나갓냐?')
        }
        socket.to(room).emit("receive-message", `(${socket.id}) joined ${room} room`)
        cb(`Joined ${room} room`)
        socket.emit('updateRoomList', room); //해당 소켓에게만 업데이트된 방 목록을 전송
    })
    socket.on("leave-room", (room) => {
        console.log(room, '방아웃');
        socket.leave(room);
        socket.to(room).emit('left-message', `User ${socket.id} left room ${room}`);
    });
})

export default router;
