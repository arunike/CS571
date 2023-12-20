// !!! IMPORTANT !!!
// Be sure to run 'npm run dev' from a
// terminal in the 'backend' directory!

import express from 'express';
import sqlite3 from 'sqlite3';
import fs from 'fs';

import { applyRateLimiting, applyLooseCORSPolicy, applyBodyParsing, applyLogging, applyErrorCatching } from './api-middleware.js'

const app = express();
const port = 53706;

const GET_POST_SQL = 'SELECT * FROM BadgerMessage;'
const INSERT_POST_SQL = 'INSERT INTO BadgerMessage(title, content, created) VALUES (?, ?, ?) RETURNING id;'
const DELETE_POST_SQL = "DELETE FROM BadgerMessage WHERE id = ?;"

const FS_DB = process.env['MINI_BADGERCHAT_DB_LOC'] ?? "./db.db";
const FS_INIT_SQL = "./includes/init.sql";

const db = await new sqlite3.Database(FS_DB, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
db.serialize(() => {
    const INIT_SQL = fs.readFileSync(FS_INIT_SQL).toString();
    INIT_SQL.replaceAll(/\t\r\n/g, ' ').split(';').filter(str => str).forEach((stmt) => db.run(stmt + ';'));
});

applyRateLimiting(app);
applyLooseCORSPolicy(app);
applyBodyParsing(app);
applyLogging(app);

app.get('/api/hello-world', (req, res) => {
    res.status(200).send({
        msg: "Hello! :)"
    })
})

app.get('/api/messages', (req, res) => {
    db.prepare(GET_POST_SQL).get().all((err, ret) => {
        if (err) {
            res.status(500).send({
                msg: "Something went wrong!",
                err: err
            });
        } else {
            res.status(200).send(ret);
        }
    })
})

app.post('/api/messages', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    if (!title || !content) {
        res.status(400).send({
            msg: "A post must have a title and content!"
        })
    } else {
        db.prepare(INSERT_POST_SQL).get(title, content, new Date(), (err, ret) => {
            if (err) {
                res.status(500).send({
                    msg: "Something went wrong!",
                    err: err
                });
            } else {
                res.status(200).send({
                    msg: "Successfully posted!",
                    id: ret.id
                })
            }
        })
    }
})

app.delete('/api/messages/:messageId', (req, res) => {
    const messageId = req.params.messageId;
    console.log("I should delete message " + messageId + "...");

    db.run(DELETE_POST_SQL, messageId, (err) => {
        if (err) {
            res.status(500).send({
                msg: "Something went wrong!",
                err: err
            });
        } else {
            res.status(200).send({
                msg: "Successfully deleted post!"
            });
        }
    });
});

applyErrorCatching(app);

// Open server for business!
app.listen(port, () => {
    console.log(`My API has been opened on :${port}`)
});
