require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true });

const urlSchema = new mongoose.Schema({
  id: Number,
  url: String
});

const urlModel = mongoose.model("url", urlSchema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  let reg = /https:\/\/www.|http:\/\/www./g;

  dns.lookup(req.body.url.replace(reg, ""), (e) => {
    if (e) return res.json({"error":"invalid URL"});
    urlModel
      .find()
      .exec()
      .then(data => {
        new urlModel({
          id: data.length + 1,
          url: req.body.url
        })
          .save()
          .then(() => {
            res.json({
              original_url: req.body.url,
              short_url: data.length + 1
            });
          })
          .catch(e => res.json(e));
      });
    });
})

app.get("/api/shorturl/:num", function(req, res) {
  urlModel
    .find({ id: req.params.num })
    .exec()
    .then(url => {
      res.redirect(url[0]["url"]);
    });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
