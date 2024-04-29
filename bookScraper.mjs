import puppeteer from "puppeteer";
import random_useragent from 'random-useragent'
import fs from 'fs'


(async () => {
    // Open Browser
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    // Setup Browser
    page.setDefaultTimeout(10000)
    await page.setViewport({ width: 1200, height: 800 })
    await page.setUserAgent(random_useragent.getRandom())

    // Get Data From bookstore
    await page.goto('https://books.toscrape.com/catalogue/tipping-the-velvet_999/index.html')
    await page.waitForSelector('.product_main')
    await page.waitForSelector('.price_color')
    const title = await page.$eval('.product_main > h1', el => el.innerHTML)
    const trimTitle = title.trim()
    const price = await page.$eval('.price_color', el => el.innerHTML)

    // Get Date
    const date = new Date()
    const day = date.getDay()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const fullDate = `${day}/${month}/${year}`

    // Save data to the textfile
    const logger = fs.createWriteStream('log.txt', { flags: 'a' })
    logger.write(`${fullDate} - ${trimTitle} - ${price}\n`)
    logger.close()

    // console.log(fullDate, ' - ', trimTitle, ' - ', price);

    await browser.close()

})()
    .catch(error => {
        console.log(error);
    })