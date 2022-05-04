const puppeteer = require('puppeteer');


require('dotenv').config();

var config={
    username: process.env.INSTAGRAMUSERNAME,
    password: process.env.INSTAGRAMPASSWORD
}

var images = [];


async function scrapeInstagram(profile, usernameAndPasswordConfig)
{
    const browser = await puppeteer.launch({headless:false});

    const page = await browser.newPage();

    await page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher");

    await page.waitForTimeout(1000);

    await page.type("input[name='username']", usernameAndPasswordConfig.username);

    await page.type("input[name='password']", usernameAndPasswordConfig.password);

    await ( await page.$("button[type='submit']")).click();

    await page.waitForTimeout(5000);

    await page.goto(`https://www.instagram.com/${profile}/`);

    var allImages = await page.evaluate(()=>{
        
         
        var allImagesarr=[];

        document.querySelectorAll("img").forEach(img => {
            var link = img.getAttribute("src");
            allImagesarr.push({
                link:link
            })
        })
        allImagesarr.shift();
       
        return allImagesarr;

    });
    console.log(allImages);
    console.log(allImages.length);
}

    scrapeInstagram(process.env.INSTAGRAMPROFILE, config);


