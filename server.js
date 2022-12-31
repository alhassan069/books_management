let express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');
const path = require('path');

const api = require('../backend/routes/file.routes');
const processApi = require('../backend/routes/process.routes');
const getAllApi = require('../backend/routes/get.routes');
const getOneApi = require('../backend/routes/find_a_book.routes');
const addOne = require('./routes/add_a_book.routes')
const app = express();

const db = require('./models');

db.sequelize.sync().then(() => {
    console.log("server running")
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend", 'build')));

app.get("", async(req, res) => {
    res.sendFile(path.join(__dirname, "frontend", 'build', 'index.html'));
})
app.use('/api', api);
app.use('/process', processApi);
app.use('/getall', getAllApi);
app.use('/getone', getOneApi);
app.use('/add', addOne)
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})



app.use((req, res, next) => {
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});
app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});