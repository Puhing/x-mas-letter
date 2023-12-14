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
    res.render('mailbox', {
        title: '크리스마스 우체통',
    });
});

// 방문왔을때, 해당하는 유저가 있는지 체크
router.get('/user_check', async (req, res) => {
    console.log(req.query);
    const { user } = req.query;
    try {
        const _user = await db.one(`SELECT * FROM TB_USER WHERE userId = ?`, [decrypt(user)]);
        const m = await db.one(`SELECT COUNT(*) as count FROM TB_USER_MAILBOX WHERE userId = ?`, [_user.userId]);
        return res.json({ status: 1, msg: 'Success', user: _user, mail: m.count });
    } catch (err) {
        console.log(err);
        return res.json({ status: -1, msg: 'Failed' });
    }
});

export default router;
