import express from 'express';
import MySQL, { MySQLTransaction } from '../MySQL';
import config from '../config';
// routes
import user from './user';
import message from './message';
import mailbox from './mailbox';
import reader from './reader';
//
const router = express.Router();
const read_db = MySQL.read();

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', async (req, res) => {
    res.render('index', {
        title: '크리스마스 우체통',
        ...config.firebaseConfig,
        kakaoJSKey: config.kakaoConfig.jsKey,
        kakaoAPIKey: config.kakaoConfig.apiKey,
    });
});

router.use('/user', user);
router.use('/message', message);
router.use('/mailbox', mailbox);
router.use('/reader', reader);
export default router;
