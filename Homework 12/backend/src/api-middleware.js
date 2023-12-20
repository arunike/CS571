
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';

// PLEASE make this more strict based on your needs!
export function applyLooseCORSPolicy(app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
        next();
    });
}

export function applyRateLimiting(app) {
    app.use(rateLimit({
        message: {
            msg: "Too many requests, please try again later."
        },
        windowMs: 30 * 1000, // 30 seconds
        max: (req, res) => req.method === "OPTIONS" ? 0 : 100 // limit each client to 100 requests every 30 seconds
    }));
    app.set('trust proxy', 1);
}

export function applyBodyParsing(app) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
}

export function applyLogging(app) {
    app.use(morgan((tokens, req, res) => {
        return [
            tokens.date(),
            tokens['remote-addr'](req, res),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    }));
    morgan.token('date', function () {
        var p = new Date().toString().replace(/[A-Z]{3}\+/, '+').split(/ /);
        return (p[2] + '/' + p[1] + '/' + p[3] + ':' + p[4] + ' ' + p[5]);
    });
}

// Apply this at the END as a catch-all!
export function applyErrorCatching(app) {
    app.use(errorHandler());
    app.use((err, req, res, next) => {
        console.warn("Encountered an erroneous request!")
        let datetime = new Date();
        let datetimeStr = `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`;
        res.status(500).send({
            "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed.",
            "error-req": JSON.stringify(req.body),
            "date-time": datetimeStr
        })
    });

    process.on('uncaughtException', (e) => {
        console.error(e);
    });
    
    process.on('unhandledRejection', (e, p) => {
        console.error(e);
    });
}
