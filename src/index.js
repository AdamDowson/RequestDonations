import 'babel-polyfill';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.json';

let app = express();

app.get('/thank-you', function (req, res) {
	res.render(
		'thank-you',
		{ txid: req.query.txid, owed: req.query.owed, currency: req.query.currency, redirect: req.query.redirect, fiat: req.query.fiat, network: req.query.network })
});

app.server = http.createServer(app);

app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use('/demo', express.static('demo'));
app.use('/demo2', express.static('demo2'));
app.use('/makerdemo', express.static('demo-maker'));
app.use(express.static('public'));


app.use(function (err, req, res, next) {
	res.send("500" + err);
	next();
});

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;