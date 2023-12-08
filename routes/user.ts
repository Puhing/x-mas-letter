import express from 'express';
//
import MySQL from '../MySQL';
import { log } from '../util/logger';
import { encrypt, decrypt } from '../util/encryption';
//
const router = express.Router();
const read_db = MySQL.read();
const db = MySQL.write();

router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const uid = req.body.uid;
        const nickname = req.body.nickname;
        let userId: any;
        let isNew = false;
        if (uid) {
            let exist = await db.one(`SELECT * FROM TB_USER WHERE uid = ?`, [uid]);
            if (exist) {
                userId = encrypt(exist.userId.toString());
            } else {
                isNew = true;
            }
            res.json({ status: 1, msg: '로그인 완료.', userId, isNew });
        } else {
            throw 'uid parameter not in.';
        }
    } catch (err) {
        log('error', err);
        res.json({ status: -1, msg: '로그인 실패. 잠시 후 다시 시도해주세요.' });
    }
});

router.get('/signup', async (req, res) => {
    res.render('signup', {
        title: '우체통 만들기',
    });
});

router.post('/signup', async (req, res) => {
    try {
        const { uid, nickname, email } = req.body;
        console.log(req.body);
        if (uid && nickname && email) {
            let inserted = await db.query(`INSERT INTO TB_USER (uid, nickname, email) VALUES (?,?,?)`, [uid, nickname, email]);
            if (inserted.insertId > 0) {
                var userId = encrypt(inserted.insertId.toString());
                res.json({ status: 1, msg: '회원가입 완료. 환영합니다.', userId });
            } else {
                throw 'cannot insert userId' + uid;
            }
        }
    } catch (err) {
        log('error', err);
        res.json({ status: -1, msg: '회원가입 실패. 잠시 후 다시 시도해주세요.' });
    }
});

router.post('/handshake', async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            const _userId = decrypt(userId);
            let user = await db.one(`SELECT * FROM TB_USER WHERE userId = ?`, [_userId]);
            if (user) {
                let m = await db.one(`SELECT COUNT(*) as count FROM TB_USER_MAILBOX WHERE userId = ?`, [user.userId]);
                res.json({ status: 1, msg: 'Success', user, mail: m.count });
            } else {
                throw 'cannot find userId : ' + userId;
            }
        }
    } catch (err) {
        log('error', err);
        res.json({ status: -1, msg: '로그인 해주세요.' });
    }
});

export default router;
