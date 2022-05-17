
const puppeteer = require('puppeteer');

async function scrapeInstagram(profile)
{
    //Open browser. Headless means that there is no browser visually being opened. 
    // For debugging headless: false is recomended, you are shown the whole process
    // of puppeteer loggin in. 
    const browser = await puppeteer.launch({headless:true});
    try 
    {
    
        const page = await browser.newPage();

        await page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher");

        await page.waitForTimeout(5000);
        // wait for page to load

        await page.type("input[name='username']", process.env.INSTAGRAMUSERNAME );

        await page.type("input[name='password']", process.env.INSTAGRAMPASSWORD);

        await ( await page.$("button[type='submit']")).click();

        await page.waitForTimeout(5000);

        await page.goto(`https://www.instagram.com/${profile}/`);

        //On instagram, the class ySN3v holds the images we are looking for. 
        var allImages = await page.evaluate(()=>{

            var allImagesarr=[];
            //Select all img tags inside of the .ySN3v div. 
            
            if(document.querySelector(".ySN3v")!==null)
            {
                const select =document.querySelector(".ySN3v")
                const inner = select.querySelectorAll("img").forEach(img => 
                {
                    var link = img.getAttribute("src");
                    allImagesarr.push({link:link}) 
                 }) 

            } 
            else
            {
                console.log("There was an issue with loggin into the instagram account")
                allImagesarr.push({link:"Need to re-connect to instagram."})
            }
        
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
    finally {
        // close Puppetteer after finish to prevent dataleaks. 
        await browser.close();
    }
   
}

exports.scrapeInstagram = scrapeInstagram;

