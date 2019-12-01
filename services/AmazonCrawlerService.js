const puppeteer = require('puppeteer');
const domain = "https://www.amazon.com";
const crawlData = async (keyword) => {

    // wrapper to catch errors
    try {
        const chromeOptions = {
            defaultViewport: { width: 1280, height: 1080 },
        };
        // create a new browser instance
        const browser = await puppeteer.launch(chromeOptions);
        // create a page inside the browser;
        const page = await browser.newPage();
        // await page.setUserAgent(randomUseragent.getRandom())
        // navigate to a website and set the viewport
        await page.goto(domain);
        // search and wait the product list

        if (await page.$('.a-container ') !== null) {
            page.click('a[onclick="window.location.reload()"]', { waitUntil: 'loaded' })
        }
        await page.waitForSelector('#twotabsearchtextbox')
        await page.evaluate((keyword) => {
            document.querySelector('#twotabsearchtextbox').value = keyword
        }, keyword)
        await page.click('input.nav-input');
        await page.waitForSelector('.s-image');
        // create a screenshots
        const products = await page.evaluate(() => {
            const productList = Array.from(document.querySelectorAll('.s-search-results > div.s-result-item[data-asin]:not([data-asin=""])')).slice(0, 3);
            return productList.map(product => {
                const p = {
                    name: product.querySelector(".a-text-normal") ? product.querySelector(".a-text-normal").innerText : null,
                    link: product.querySelector('.a-link-normal.a-text-normal') ? product.querySelector('.a-link-normal.a-text-normal').href : null,
                    image: product.querySelector('.s-image').src,
                }
                const price = product.querySelector(".a-price-whole")
                p.price = price ? parseFloat(`${price.textContent}${product.querySelector('.a-price-fraction').innerText}`) : null
                return p
            })
        });
        console.log(products)
        await browser.close();
        return products
    } catch (error) {
        // display errors
        console.log(error)
    }
}
module.exports = {
    crawlData
}