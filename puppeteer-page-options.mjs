import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    // devtools: true,
})

const page = await browser.newPage()
await page.goto('https://dev.to/', { waitUntil: "load", timeout: 0 })
// // const searchValue = await page.$eval('.crayons-story__title', el => el.textContent.trim())
// const allH2 = await page.$$eval('.crayons-story__title', elements => elements.length)
// const allH2Title = await page.$$eval('.crayons-story__title', elements => {
//     return elements.map(el => el.textContent.trim())
// })

// page.setDefaultTimeout(1000)
// page.setDefaultNavigationTimeout(20000)

await page.waitForSelector('.crayons-header--search-input')
await page.focus('.crayons-header--search-input');
await page.type('.crayons-header--search-input', 'learning')
// await page.keyboard.press('Enter', { delay: 20 })

await page.keyboard.down('Enter')
await page.keyboard.up('Enter')




// await page.goto('https://devexpress.github.io/testcafe/example/')
// await page.type('#developer-name', 'Abdur Rahman', { delay: 200 })
// await page.click('#tried-test-cafe')
// await page.select('#preferred-interface', 'JavaScript API')
// const msg = 'Hi this is Abdur Rahman'
// await page.type('#comments', msg)
// await page.click('#submit-button')
// await page.waitForSelector('#article-header')
// await page.goto('https://dev.to/')
// await page.waitForSelector('#header-search')
// await page.goBack()
// await page.waitForSelector('h1')
// await page.goForward('#header-search')
// console.log(allH2);
// console.log(allH2Title);
await browser.close()