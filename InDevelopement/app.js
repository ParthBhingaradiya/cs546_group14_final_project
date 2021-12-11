const express = require('express');
const path = require('path');
const os = require('os');

const port = 3001;
const handlebars = require('express-handlebars')
const app = express();
// Database Thrift
const { MongoClient } = require('mongodb');
// const commonMW = require('./middleware/commonMW');
// const userRoute = require('./routes/user.route')
const loginRoute = require('./routes/login.route')
const productRoute = require('./routes/product')
const configRoutes = require('./routes');
const middleware = require('./middleware');
// const adminRoute = require('./routes/admin.route')
// const customerRoute = require('./routes/customer.route')
// const barberRoute = require('./routes/barber.route')

const bodyParser = require('body-parser');
const session = require('express-session');
const store = new session.MemoryStore();
var NedbStore = require('nedb-session-store')(session);


const cookieParser = require("cookie-parser");
// const authMW = require('./middleware/authMW');
// const UserService = require('./services/user.service');

require('./services/hbsHelpers')
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function main() {
    const uri = "mongodb://localhost:27017/thrift";
    const client = new MongoClient(uri)
    global.dbClient = client;
    try {
        await client.connect();
        console.log("Mongodb is connected")

        // Handlebars
        app.set('view engine', 'handlebars')

        const handlebarEngine = handlebars.create({
            layoutsDir: `${__dirname}/views/layouts`,
            extname: 'handlebars',
            defaultLayout: 'index',
            partialsDir: `${__dirname}/views/partials`,
        })

        app.engine('handlebars', handlebarEngine.engine)
        app.use(express.static('public'))
        app.use(session({
            secret: 'secret',
            saveUninitialized: true,
            cookie: { maxAge: 1000 * 60 * 60 * 24 },
            resave: false,
            store: new NedbStore({
                filename: path.join(os.tmpdir(), "thrift-session.db")
            })
        }))


        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        //serving public file
        app.use(express.static(path.join(__dirname, "public")));
        app.use(cookieParser());



        app.use(bodyParser.json({ limit: '200mb', extended: true }));
        // app.use(commonMW)
        // app.use(authMW)
        var log = function (req, res, next) {
            console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl)
            next()
        }

        app.use(log)

        middleware(app);
        app.use("/", loginRoute)
        configRoutes(app);
        app.listen(port, async () => {
            console.log(`Your server is running on http://localhost:${port}`);
        })

    } catch (e) {
        console.log("Error occurred while starting app", e)
    }
}

main().catch(console.error)