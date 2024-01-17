import express from 'express';
import { createServer } from "http";
import Server from "socket.io";
import { Socket } from "socket.io";
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';

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

router.post('/save_chat', async (req, res) => {
    const { nickname, content, socketId, visit, roomNow } = req.body;
    const directory = 'public/uploads';
    
    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            const userId = _user.userId;
            
            if (userId && !isNaN(userId)) {
                let result = await db.query(`INSERT INTO TB_USER_CHAT (socketId, content, type, addedAt, nickname, roomNow) VALUES (?, ?, 1, NOW(), ?, ?)`, [
                    socketId,
                    content,
                    nickname,
                    roomNow
                ]);
                if (result.insertId > 0) {

                    fs.writeFile(`${directory}/chat_${result.insertId}.txt`, content, (err) => {
                        if (err) {
                            console.error('Error while writing file:', err);
                            return res.json({ status: -1, msg: 'Failed to save chat text file' });
                        }
                        console.log('Chat text file created');
                        return res.json({ status: 1, msg: 'File saved' });
                    });
                } else {
                    throw 'Cannot insert TB_USER_CHAT';
                }
            }
        }else {
            return res.json({ status: -1, msg: 'Failed' });
        }
    } catch (err) {
        console.log('error : ', err);
        return res.json({ status: -1, msg: 'Failed' });
    }
});

router.post('/save_img', upload.single('file'), async (req, res) => {
    const { nickname, socketId, visit, roomNow } = req.body;
    const directory = 'public/uploads';
    
    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            const userId = _user.userId;
            
            if (userId && !isNaN(userId)) {
                let result = await db.query(`INSERT INTO TB_USER_CHAT (socketId, content, type, addedAt, nickname, roomNow) VALUES (?, ?, 1, NOW(), ?, ?)`, [
                    socketId,
                    req.file.path,
                    nickname,
                    roomNow,
                ]);
                if (result.insertId > 0) {
                    return res.json({ status: 1, msg: 'Success' });
                } else {
                    throw 'Cannot insert TB_USER_CHAT';
                }
            }
        }else{
            return res.json({ status: -1, msg: 'Failed' });
        }
    } catch (err) {
        console.log('error : ', err);
        return res.json({ status: -1, msg: 'Failed' });
    }
});

router.post('/save_audio', upload.single('file'), async (req, res) => {
    const { nickname, socketId, visit, roomNow } = req.body;
    const directory = 'public/uploads';
    console.log(req.file.path, 'ㅁㄴ임이ㅏㅁㄴ엄나ㅣ어');
    
    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            const userId = _user.userId;
            
            if (userId && !isNaN(userId)) {
                let result = await db.query(`INSERT INTO TB_USER_CHAT (socketId, content, type, addedAt, nickname, roomNow) VALUES (?, ?, 2, NOW(), ?, ?)`, [
                    socketId,
                    req.file.path,
                    nickname,
                    roomNow,
                ]);
                if (result.insertId > 0) {
                    return res.json({ status: 1, msg: 'Success' });
                } else {
                    throw 'Cannot insert TB_USER_CHAT';
                }
            }
        }else{
            return res.json({ status: -1, msg: 'Failed' });
        }
    } catch (err) {
        console.log('error : ', err);
        return res.json({ status: -1, msg: 'Failed' });
    }
});

router.post('/save_video', upload.single('file'), async (req, res) => {
    const { nickname, socketId, visit, roomNow } = req.body;
    const directory = 'public/uploads';
    console.log(req.file.path, 'ㅁㄴ임이ㅏㅁㄴ엄나ㅣ어');
    
    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            const userId = _user.userId;
            
            if (userId && !isNaN(userId)) {
                let result = await db.query(`INSERT INTO TB_USER_CHAT (socketId, content, type, addedAt, nickname, roomNow) VALUES (?, ?, 2, NOW(), ?, ?)`, [
                    socketId,
                    req.file.path,
                    nickname,
                    roomNow,
                ]);
                if (result.insertId > 0) {
                    return res.json({ status: 1, msg: 'Success' });
                } else {
                    throw 'Cannot insert TB_USER_CHAT';
                }
            }
        }else{
            return res.json({ status: -1, msg: 'Failed' });
        }
    } catch (err) {
        console.log('error : ', err);
        return res.json({ status: -1, msg: 'Failed' });
    }
});

io.on("connection", socket => {

    socket.on("join", (publicRoom) => {
        // 특정 방에 입장
        socket.join(publicRoom);
        // 클라이언트에게 방에 입장했다는 신호를 보냄
        io.to(socket.id).emit("joined", publicRoom);
        console.log(socket.adapter.rooms, "입장확인")
    });
    
    socket.on("send-message", (message, room) => {
        if (room === ''){
            socket.to("public").emit("receive-message", message)
            console.log(message, "여기보슈", room)
            console.log(socket.adapter.rooms, "퍼블릭방")
        } else {
            socket.to(room).emit("receive-message", message)
            console.log(message, "여기보세에여여2", room)
            console.log(socket.adapter.rooms, "방정보")
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

    socket.on('send-file', (fileData) => {
        const { type, data } = fileData;
    
        // Handle different file types
        switch (type) {
            case 'audio':
                // Handle audio file
                console.log('Received audio file data');
                break;
            case 'image':
                // Handle image file
                console.log('Received image file data');
                break;
            case 'webm':
                // Handle webm file
                console.log('Received webm file data');
                break;
            case 'video':
                // Handle video file
                console.log('Received video file data');
                break;
            default:
                console.log('Unsupported file type');
                return;
        }
    
        // Broadcast the file data to all connected clients
        io.emit('receive-file', { type, data });
    });

    // socket.on('send-audio', (data) => {
    //     const fileName = 'receivedVoice.wav'; // 저장할 파일명
    //     const base64Data = data.replace(/^data:audio\/wav;base64,/, '');
    //     fs.writeFile(`public/${fileName}`, base64Data, 'base64', (err) => {
    //         if (err) throw err;
    //         console.log('Voice file saved!');
    //     });
    // });

    // socket.on('save-img', (data) => {
    //     const fileName = 'receivedImage.png'; // 저장할 파일명
    //     const base64Data = data.replace(/^data:image\/png;base64,/, '');

    //     fs.writeFile(`public/uploads/${fileName}`, base64Data, 'base64', (err) => {
    //         if (err) throw err;
    //         console.log('Image file saved!');
    //     });
    // });
})

export default router;
