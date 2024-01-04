import express from 'express';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

//
import MySQL from '../MySQL';
import { upload } from '../util/fileupload';
import { decrypt } from '../util/encryption';
//
const router = express.Router();
const read_db = MySQL.read();
const db = MySQL.write();

const app = express();

app.use('/public', express.static('public')); // 정적 파일 서빙 설정

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

router.get('/', async (req, res) => {
    res.render('reader', {
        title: '우체통',
    });
});

router.get('/get_mailbox', async (req, res) => {
    const { userId } = req.query;
    try {
        const _userId = decrypt(userId);
        const list = await db.query(
            `SELECT 
                um.type,
                um.addedAt, 
                um.id, 
                IF(qm.author IS NULL, um.from, qm.author) AS 'from', 
                IF(qm.contents is null, um.content, qm.contents) AS 'content'
            FROM TB_USER_MAILBOX um
            LEFT JOIN TB_QWER_MAILBOX qm
                ON qm.id = um.content 
            WHERE um.userId = ?;
    `,
            [_userId]
        );
        if (list) {
            return res.json({ status: 1, msg: 'Success', list: list });
        } else {
            throw 'Cannot load list';
        }
    } catch (err) {
        return res.json({ status: -1, msg: 'Failed' });
    }
});


// router.get('/download/:filename', (req, res) => {
//     const fileName = req.params.filename;
//     const filePath = path.join(__dirname, 'public/uploads', fileName); // 파일이 있는 경로 설정

//     // 파일이 존재하는지 확인 후 응답
//     if (fs.existsSync(filePath)) {
//         res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//         res.setHeader('Content-Type', 'text/plain'); // MIME 타입을 명시적으로 지정
//         res.sendFile(filePath);
//     } else {
//         res.status(404).send('File not found');
//     }
// });


export default router;
