const http = require('http');

const hostname = '127.0.0.1';
const port = 2001;

const express = require('express');
const app = express();

const es6render = require('express-es6-template-engine');
app.engine('html', es6render);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);
const db = require('./db');
console.log(db);

app.get("/", (req, res) => {
    res.render('home', {
        partials: {
            head: '/partials/head'
        }
    });
});

app.get('/friends', (req, res) => {
    res.render("friends-list", {
        locals: {
            friends: db,
            path: req.path
        },
        partials: {
            head: 'partials/head'
        }
    });
});

app.get('/friends/:handle', (req, res) => {
    const { handle } = req.params;
    const friend = db.find(f => f.handle === handle);

    if (friend) {
        res.render('friend', {
            locals: {
                friend
            },
            partials: {
                head: 'partials/head'
            }
        });
    } else {
        res.status(404)
            .send(`no friend with the handle ${handle}`);
    }
    
});


server.listen(port, () => {
    console.log(`The server is running: http://${hostname}:${port}`);
});