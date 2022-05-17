const express = require('express')
const mongoose = require('mongoose')
const Image = require('./models/image');
const webscrapper = require("./webscrapper");

require('dotenv').config();

// Config will be used when puppeteer is logging into the provided instagram account. 
var config={
    username: process.env.INSTAGRAMUSERNAME,
    password: process.env.INSTAGRAMPASSWORD
}

const app = express();
const port = 3001 || process.env.PORT;

// Set up a connection string. MongoDB Atlas used in this example
const uri = process.env.URI;
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true})
.then((result) => {
    // Ensure you connect to database before spinning up express server. 
    console.log('connected to db');
    app.listen(port)
}).catch((err) => console.log(err));

// When this route is caled it automaticaly sends back a status 200 because
// the async code will take about a minute to run. 
app.get('/refreshimages', async (req, res) => {

    res.sendStatus(200);
    // Mongoose is used here. The image model is from models/image.js 
    await Image.deleteMany({}); 
    //Delete out database to start from empty. 
    console.log("Deleting Images...");
    const imgarr = new Promise((resolve, reject) => 
    {
        console.log("Scrapping Images from Instagram Account...");
        webscrapper.scrapeInstagram(process.env.INSTAGRAMPROFILE, config)
        .then(data => 
        {
            // loop through the array that was returned from the scrapping process
            // add each Item to the database. 
            data.forEach(async (item) => 
            {
                await Image.create({link:item.link, dateCreated: new Date})
            })  
        resolve(data)
        console.log("Scrape Complete!");

        }).catch(err => reject('Scrape failed.'))
    });
})

setInterval(async () => {
    await Image.deleteMany({}); 
    const imgarr = new Promise((resolve, reject) => 
    {
        console.log("Scrapping Images from Instagram Account...");
        webscrapper.scrapeInstagram(process.env.INSTAGRAMPROFILE, config)
        .then(data => 
        {
            // loop through the array that was returned from the scrapping process
            // add each Item to the database. 
            data.forEach(async (item) => 
            {
                await Image.create({link:item.link, dateCreated: new Date})
            })  
        resolve(data)
        console.log("Scrape Complete!");

        }).catch(err => reject('Scrape failed.'))
    });

},60*1000 )




