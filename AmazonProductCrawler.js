const puppeteer = require('puppeteer');
const domain = "https://www.amazon.com";
const crawlData = async (keyword) => {
    // wrapper to catch errors
    try {
        // create a new browser instance
        const browser = await puppeteer.launch();
        // create a page inside the browser;
        const page = await browser.newPage();
        // navigate to a website and set the viewport
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(domain, {
            timeout: 3000000
        });
        // search and wait the product list
        await page.type('#twotabsearchtextbox', keyword);
        await page.click('input.nav-input');
        await page.waitForSelector('.s-image');
        // create a screenshots
        const products = await page.evaluate(() => {
            const productList = Array.from(document.querySelectorAll('.s-search-results > div.s-result-item')).slice(0, 3);
            return productList.map(product => {
                console.log(product)
                const p = {
                    name: product.querySelector(".a-text-normal") ? product.querySelector(".a-text-normal").innerText : null,
                    link: product.querySelector('.a-link-normal') ? product.querySelector('.a-link-normal').href : null,
                    image: product.querySelector('.s-image').src,
                }
                const price = product.querySelector(".a-price-whole")
                p.price = price ? parseFloat(`${price.textContent}${product.querySelector('.a-price-fraction').innerText}`) : null
                return p
            })
        });
        console.log(products)
        await browser.close();
    } catch (error) {
        // display errors
        console.log(error)
    }
}
module.exports = {
    crawlData
}