const puppeteer = require('puppeteer');
const express = require('express')
const mongoose = require('mongoose')
const Image = require('./models/image');
const webscrapper = require("./webscrapper");
require('dotenv').config();


var config={
    username: process.env.INSTAGRAMUSERNAME,
    password: process.env.INSTAGRAMPASSWORD
}

const app = express();
const port = 3001 || process.env.PORT;

const uri = "mongodb+srv://apuser:test123@cluster0.j3fag.mongodb.net/ninostacos?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true})
.then((result) => {
    console.log('connected to db');
    app.listen(port)
}).catch((err) => console.log(err));

app.get('/refreshimages', async (req, res) => {

    res.sendStatus(200);
    await Image.deleteMany({}); //clears out the collection
    const imgarr = new Promise((resolve, reject) => 
    {
        webscrapper.scrapeInstagram(process.env.INSTAGRAMPROFILE, config)
        .then(data => {
        data.forEach(async (item) => {
           await Image.create({link:item.link, dateCreated: new Date})
        })  
      
        resolve(data)
        console.log("scrapped");


      })
      .catch(err => reject('scrape failed'))
    });
})





