import bodyParser from 'body-parser';
import express from 'express';
//
import routes from './routes';
import { RedisStorage } from './util/Storage';
const storage = new RedisStorage();
storage.connect();

const app = express();

app.use('/', express.static('./public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//     session({
//         secret: "@#@$MYSIGN#@$#$",
//         resave: false,
//         saveUninitialized: true,
//     })
// );
app.use('/', routes);

var server = app.listen(3033, function () {
    console.log('Express server has started on port 3033');
});
