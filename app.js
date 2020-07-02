require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const shortId = require('shortid');
const validUrl = require('valid-url');
const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.MONGOID, {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/' ,express.static(__dirname + '/public'));

// create schema for urls
let url_schema = new mongoose.Schema({url: String, short: String});
let url_model = mongoose.model('ListUrl', url_schema);

app.get('/new/:url(*)', (req, res) => {
    let url = req.params.url == '' ? req.query.url : req.params.url;

    if(validUrl.isUri(url)) {

        let shortid = shortId.generate();

        new url_model({url: url, short: shortid}).save((err, result) => {
            if(err) throw err;

            res.json({
                original_url: url, 
                short_url: `http://localhost:${port||3000}/api/${shortid}`  
            });
        })

    }else {
        res.json({error:"invalid URL"})
    }
})

app.get('/api/:id', (req, res) => {
    url_model.find({short: req.params.id}, (err, result) => {
        if(err) {
            return res.status(400).send('not found');
        };

        let url = result[0].url;

        res.redirect(url);
    })
})

app.listen(port || 3000);