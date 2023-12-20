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
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}
router.get('/', async (req, res) => {
    res.render('mailbox', {
        title: '크리스마스 우체통',
    });
});

// 방문왔을때, 해당하는 유저가 있는지 체크
router.get('/user_check', async (req, res) => {
    console.log("user_check", req.query);
    const { user } = req.query;
    try {
        const _user = await db.one(`SELECT * FROM TB_USER WHERE uuid = ?`, [user], null,true);
        console.log(_user)
        if(_user){
            const m = await db.one(`SELECT COUNT(*) as count FROM TB_USER_MAILBOX WHERE userId = ?`, [_user.userId]);
            return res.json({ status: 1, msg: 'Success', user: _user, mail: m.count });
        }
    } catch (err) {
        console.error(err)
    }
    return res.json({ status: -1, msg: 'Failed' });
});

router.post('/get_qwer', async (req, res) => {
    console.log(req.query);
    const { userId } = req.body;
    if (userId) {
        const _userId = decrypt(userId);
        let _result = 0;
        let whos = await db.query(`
            SELECT who FROM TB_REQUEST_QWER WHERE userId=?
        `, [_userId]);

        let more = null;
        if(whos.length < 5){
            try{
                let rr = [0,1,2,3,4];
                for(let who of whos){
                    console.log(rr)
                    let idx = rr.findIndex((v)=>v== who.who);
                    if( idx >= 0 ){
                        console.log(">idx>",idx)
                        rr.splice(idx, 1);
                    }
                }

                shuffle(rr);

                await db.query(`
                    INSERT INTO TB_REQUEST_QWER (userId, who, addedAt, requestDate)
                    VALUES (?, ?, NOW(), NOW());
                `, [_userId, rr[0]]);

                await db.query(`
                    INSERT INTO TB_USER_MAILBOX (\`userId\`, \`content\`, \`type\`, \`addedAt\`, \`from\`)
                    VALUES (?, ?, 10, NOW(), ?);
                `,[_userId, "-", rr[0]])

                more = rr[0]
                _result = 1;
            }catch(err){
                console.log(err)
                _result = 0;
            }
            let cnt = await db.one(`
                SELECT count(*) as cnt FROM TB_REQUEST_QWER WHERE userId=?
            `, [_userId]);

            let today = await db.one(`
                SELECT * FROM TB_REQUEST_QWER WHERE userId=? AND requestDate=CURDATE()
            `, [_userId]);
            
            return res.json({ status: _result, cnt:cnt.cnt, more, today:today.who, msg: 'Already' });
        }else{
            return res.json({ status: -2, cnt:whos.length, msg: 'Already' });
        }
    }else{
        return res.json({ status: -1, msg: 'Failed' });
    }
});

export default router;
