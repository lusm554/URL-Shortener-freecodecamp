require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const shortId = require('shortid');
const validUrl = require('valid-url');
const app = express();

mongoose.connect(process.env.MONGOID, {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/' ,express.static(__dirname + '/public'));

// create schema for urls
let url_schema = new mongoose.Schema({url: String, short: String});
let url_model = mongoose.model('ListUrl', url_schema);

app.get('/new/:url(*)', (req, res) => {
    let url = req.params.url;

    if(validUrl.isUri(url)) {

        let shortid = shortId.generate();

        new url_model({url: url, short: shortid}).save((err, result) => {
            if(err) throw err;

            res.json(result);
        })

    }else {
        res.json('not valid url');
    }
})

app.listen(process.env.PORT || 3000);

/**
 * /new
 * 1. Check the url 
 * 2. Create shortId for this url 
 * 3. Write this to db
 * 
 * /:id
 * 1. Get url from query line
 * 2. Get document from this url
 * 3. Send json to user
 */