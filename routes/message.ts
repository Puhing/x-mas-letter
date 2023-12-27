import express from 'express';
import moment from 'moment';
import fs from 'fs';

//
import MySQL from '../MySQL';
import { upload } from '../util/fileupload';
import { decrypt } from '../util/encryption';
//
const router = express.Router();
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
    try {
        const _user = await db.one(`SELECT userId FROM TB_USER WHERE uuid = ?`, [visit]);
        if(_user){
            let result = await db.query(`INSERT INTO TB_USER_MAILBOX (userId, file, type, addedAt, \`from\`) VALUES (?, ?, 2, NOW(), ?)`, [_user.userId, req.file.path, nickname]);
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
    const { nickname, content, visit } = req.body;
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
                if (result.insertId > 0) {
                    return res.json({ status: 1, msg: 'Success' });
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
