import puppeteer from "puppeteer";
import fs from 'fs';

async function scraper() {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.flipkart.com/search?q=mobile&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off', {
        timeout: 0,
        waitUntil: "networkidle0"
    })

    const data = {
        list: []
    }

    const productData = await page.evaluate((data) => {
        const items = document.querySelectorAll('div[data-id]')
        items.forEach(item => {
            const id = item.getAttribute('data-id')
            const name = item.querySelector('.KzDlHZ') && item.querySelector('.KzDlHZ').innerText
            const rating = item.querySelector('.Y1HWO0') && item.querySelector('.Y1HWO0').innerText
            const description = item.querySelector('._6NESgJ') && item.querySelector('._6NESgJ').innerText
            const image = item.querySelector('._4WELSP .DByuf4').src

            data.list.push({
                name: name,
                id: id,
                rating: rating,
                description: description,
                image: image,
            })

        })
        return data;
    }, data)

    const json = JSON.stringify(productData)
    fs.writeFile('product.json', json, 'utf-8', () => { })

    await browser.close()
}

scraper()