import puppeteer from 'puppeteer';
import fs from 'fs'

// Scrape All Pages
async function scrapeAllPages(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const allData = [];

    try {
        // Navigate to the initial page
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage) {
            console.log(`Scraping page ${currentPage}`);

            // Scrape data from the current page
            const currentPageData = await scrapePageData(page);
            allData.push(...currentPageData);

            // Click on the "Next" button
            hasNextPage = await page.evaluate(() => {
                const nextButton = document.querySelector("div._1G0WLw nav a:last-child");
                if (nextButton) {
                    nextButton.click();
                    return true;
                }
                return false;
            });

            currentPage++;
            // Wait for a short period of time to ensure the next page loads
            await page.reload()
            await page.waitForSelector("div._1G0WLw nav a:last-child")
        }
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await browser.close();
    }

    return allData;
}

// Scrape single Page
async function scrapePageData(page) {
    const data = await page.evaluate(() => {
        const items = document.querySelectorAll('div[data-id]');
        const results = [];
        items.forEach(item => {
            const id = item.getAttribute('data-id')
            const name = item.querySelector('.KzDlHZ') && item.querySelector('.KzDlHZ').innerText
            const price = item.querySelector('._4b5DiR') && item.querySelector('._4b5DiR').innerText
            const rating = item.querySelector('.Y1HWO0 .XQDdHH') && item.querySelector('.Y1HWO0 .XQDdHH').innerText
            const description = item.querySelector('._6NESgJ') && item.querySelector('._6NESgJ').innerText
            const image = item.querySelector('._4WELSP .DByuf4') && item.querySelector('._4WELSP .DByuf4').src
            results.push({
                id: id,
                name: name,
                price: price,
                rating: rating,
                description: description,
                image: image,

            });
        });
        return results;
    });
    return data;
}

async function main() {
    const url = 'https://www.flipkart.com/search?q=mobile&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off';
    const allData = await scrapeAllPages(url);
    const json = JSON.stringify(allData, null, 2);
    fs.writeFileSync('productsAll.json', json);
    // console.log(allData);
}

main();
