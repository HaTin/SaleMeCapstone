const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const domain = "https://www.amazon.com";
const UserAgent = require('user-agents')
const crawlData = async (keyword) => {
    // const newProxyUrl = '172.104.35.250:3128'
    const proxyURLs = ['172.104.35.250:3128', '139.162.38.253:1028', '172.104.59.178:1028']
    const url = proxyURLs[Math.floor(Math.random() * proxyURLs.length)];
    console.log(url)
    let browser = null
    try {
        const chromeOptions = {
            args: [`--proxy-server=${url}`],
        };
        // create a new browser instance
        browser = await puppeteer.launch(chromeOptions);
        // create a page inside the browser;
        await page.authenticate({
            username: 'admin',
            password: 'tindeptrai12',
        });
        const page = await browser.newPage();
        const user = new UserAgent({ deviceCategory: 'desktop' })
        await page.setUserAgent(String(user.data.userAgent))
        // const currentAgent = await page.evaluate('navigator.userAgent');
        // console.log(currentAgent);
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
                // const price = product.querySelector(".a-price-whole")
                // p.price = price ? parseFloat(`${price.textContent}${product.querySelector('.a-price-fraction').innerText}`) : null
                return p
            })
        });
        // console.log(products)
        await browser.close();
        return products
    } catch (error) {
        // display errors
        console.log(error)
        browser.close()
    }
}
module.exports = {
    crawlData
}