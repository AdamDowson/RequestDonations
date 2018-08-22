import 'babel-polyfill';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.json';
var ejs = require('ejs');
var https = require('https');
var fs = require('fs');
var path = require('path');

let app = express();

app.get('/thank-you', function (req, res) {
	res.render(
		'thank-you',
		{ txid: req.query.txid, owed: req.query.owed, currency: req.query.currency, redirect: req.query.redirect, fiat: req.query.fiat })
});

// app.get('/demo', function(req, res) {
//     res.sendFile(path.join(__dirname + '/../demo/index.html'));
// });

// Server setup

// var options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/sign.wooreq.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/sign.wooreq.com/cert.pem'),
//   ca: fs.readFileSync('/etc/letsencrypt/live/sign.wooreq.com/chain.pem')
// };
// app.server = https.createServer(options, app);

app.server = http.createServer(app);

app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use('/demo', express.static('demo'));
app.use('/demo2', express.static('demo2'));
app.use(express.static('public'));


app.use(function (err, req, res, next) {
	res.send("500" + err);
});

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;