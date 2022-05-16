
const puppeteer = require('puppeteer');

async function scrapeInstagram(profile)
{
    try {
 const browser = await puppeteer.launch({headless:true});

    const page = await browser.newPage();

    await page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher");

    await page.waitForTimeout(5000);

    await page.type("input[name='username']", process.env.INSTAGRAMUSERNAME );

    await page.type("input[name='password']", process.env.INSTAGRAMPASSWORD);

    await ( await page.$("button[type='submit']")).click();

    await page.waitForTimeout(5000);

    await page.goto(`https://www.instagram.com/${profile}/`);

    //look inside class ySN3v
    var allImages = await page.evaluate(()=>{

        var allImagesarr=[];
        const select =document.querySelector(".ySN3v")
        const inner = select.querySelectorAll("img").forEach(img => {
            var link = img.getAttribute("src");
            allImagesarr.push({
                link:link
            }) 
        })
       
        return allImagesarr;

    });
        console.log(allImages);
    
        console.log(allImages.length);
        return allImages;
    } 
    catch(err)
    {
        console.log(err);
        
        return [];
    }
   
}

exports.scrapeInstagram = scrapeInstagram;

