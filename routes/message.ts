import express from 'express';
import moment from 'moment';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';

//
import MySQL from '../MySQL';
import { upload } from '../util/fileupload';
// import { txtUpload } from '../util/fileupload';
import { decrypt } from '../util/encryption';
//
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const read_db = MySQL.read();
const db = MySQL.write();

router.get('/', async (req, res) => {
    res.render('message', {
        title: '편지 남기기',
    });
});

router.post('/save_voice', upload.single('file'), async (req, res) => {
    console.log(req.body, req.file, '1차 req');
    const { nickname, visit } = req.body;
    const directory = 'public/uploads';

    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            let result = await db.query(`INSERT INTO TB_USER_MAILBOX (userId, content, type, addedAt, \`from\`) VALUES (?, ?, 2, NOW(), ?)`, [_user.userId, req.file.path, nickname]);
            if (result.insertId > 0) {
                return res.json({ status: 1, msg: 'Success' });
            } else {
                throw 'Cannot insert TB_USER_MAILBOX';
            }
        }else{
            return res.json({ status: -1, msg: 'Failed' });
        }
    } catch (err) {
        console.log('error : ', err);
        return res.json({ status: -1, msg: 'Failed' });
    }
});

router.post('/save_text', async (req, res) => {
    const { id, nickname, content, visit } = req.body;
    const directory = 'public/uploads';
    console.log(req.body, req.file, '텍스트 req 확인용');
    
    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            const userId = _user.userId;
            
            if (userId && !isNaN(userId)) {
                let result = await db.query(`INSERT INTO TB_USER_MAILBOX (userId, content, type, addedAt, \`from\`) VALUES (?, ?, 1, NOW(), ?)`, [
                    userId,
                    content,
                    nickname,
                ]);
                console.log(result, '리저트 여기');
                if (result.insertId > 0) {

                    fs.writeFile(`${directory}/text_${result.insertId}.txt`, content, (err) => {
                        if (err) {
                            console.error('Error while writing file:', err);
                            return res.json({ status: -1, msg: 'Failed to save file' });
                        }
                        console.log('Text file created');
                        return res.json({ status: 1, msg: 'File saved' });
                    });
                } else {
                    throw 'Cannot insert TB_USER_MAILBOX';
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

export default router;
