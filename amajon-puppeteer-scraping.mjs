// load puppeteer
import puppeteer from 'puppeteer'
const domain = "https://www.amazon.it";

// IIFE
(async () => {
    // wrapper to catch errors
    try {
        // create a new browser instance
        const browser = await puppeteer.launch();

        // create a page inside the browser;
        const page = await browser.newPage();

        // navigate to a website and set the viewport
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(domain, {
            timeout: 3000
        });

        // search and wait the product list
        await page.waitForSelector('#twotabsearchtextbox')
        await page.type('#twotabsearchtextbox', 'iphone x 64gb');
        await page.click('input.nav-input');
        await page.waitForSelector('.a-link-normal');

        // create a screenshots
        await page.screenshot({ path: 'search-iphone-x.png' });

        const products = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.s-result-item'));
            return links.map(link => {
                if (link.querySelector(".a-price-whole")) {
                    return {
                        name: link.querySelector(".a-size-medium.a-color-base.a-text-normal").textContent,
                        url: link.querySelector(".a-link-normal.a-text-normal").href,
                        image: link.querySelector(".s-image").src,
                        price: parseFloat(link.querySelector(".a-price-whole").textContent.replace(/[,.]/g, m => (m === ',' ? '.' : ''))),
                    };
                }
            }).slice(0, 5);
        });

        console.log(products.sort((a, b) => {
            return a.price - b.price;
        }));

        // close the browser
        await browser.close();
    } catch (error) {
        // display errors
        console.log(error)
    }
})();

// import puppeteer from 'puppeteer'
// import fs from 'fs'

// async function run() {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     let reviews = []
//     async function getPageData(pageNumber = 1) {
//         await page.goto(`https://platzi.com/cursos/html5-css3/opiniones/${pageNumber}/`)
//         // await page.screenshot({
//         //   path: 'screenshot.png',
//         //   fullPage: true,
//         // })
//         const data = await page.evaluate(() => {
//             const $reviews = document.querySelectorAll('.Review')
//             const $pagination = document.querySelectorAll('.Pagination .Pagination-number')
//             const totalPages = Number($pagination[$pagination.length - 1].textContent.trim())
//             const data = []
//             $reviews.forEach(($review) => {
//                 data.push({
//                     username: $review.querySelector('.Review-name').textContent,
//                     rating: $review.querySelectorAll('.Review-stars .fulled').length,
//                     content: $review.querySelector('.Review-description').textContent.trim(),
//                 })
//             })
//             return {
//                 reviews: data,
//                 totalPages,
//             }
//         })
//         reviews = [...reviews, ...data.reviews]
//         console.log(`page ${pageNumber} of ${data.totalPages} completed`)
//         if (pageNumber < data.totalPages) {
//             getPageData(pageNumber + 1)
//         } else {
//             fs.writeFile('data.js', `export default ${JSON.stringify(reviews)}`, () => {
//                 console.log('data writed')
//             })
//             await browser.close()
//         }
//     }
//     getPageData()
// }

// run()


// import puppeteer from 'puppeteer'
// import elasticSearch from './elastic-search/elastic'
// var ASIN = require('./Fjson.json')
// var express = require('express')
// var app = express()

// const SEARCH_URL = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=(KEYWORD)&page=(PAGE)"
// const PRODUCT_URL = "https://www.amazon.com/dp/"
// const PAGE_LIMIT = 20
// search_fields = require('./product-list')

// const SEARCH_RESULT_SELECTOR = '#s-results-list-atf > li'
// const PRODUCT_TITLE_SELECTOR = "#productTitle"

// async function getDriver() {
//     var browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     return browser
// }

// allAsins = []
// browser = null

// async function getAnother(page) {
//     let asins = await page.evaluate((sel) => {
//         var now = Array.from(document.querySelectorAll(".a-carousel-card > div"))
//         return now.map(nw => nw ? nw.getAttribute('data-asin') : null)
//     })

//     console.log(asins)
//     asins.forEach(item => {
//         if (item)
//             allAsins.push(item)
//     })
// }


// async function getProduct(asin) {
//     if (!asin) return
//     try {
//         let page = await browser.newPage()
//         url = PRODUCT_URL + asin

//         await page.goto(url, { waitUntil: 'domcontentloaded' })

//         productTitle = await page.evaluate((sel) => {
//             var ele = document.querySelector(sel)
//             return ele ? ele.innerHTML.trim() : null
//         }, '#productTitle')


//         images = await page.evaluate((sel) => {
//             var imgs = Array.from(document.querySelectorAll('li > span > span > span > span > img'))
//             return imgs.map(img => img.getAttribute('src'))
//         })

//         price = null
//         if (await page.$("#priceblock_ourprice") !== null) {
//             price = await page.evaluate((sel) => {
//                 var now = document.querySelector('#priceblock_ourprice')
//                 return now ? parseFloat(now.innerHTML.replace('$', '')) * 100.0 : null
//             })
//         }
//         else if (await page.$("#price_inside_buybox") !== null) {
//             price = await page.evaluate((sel) => {
//                 var now = document.querySelector('#price_inside_buybox')
//                 return now ? parseFloat(now.innerHTML.replace('$', '')) * 100.0 : null
//             })
//         }

//         console.log(asin, productTitle, images, price)

//         if (productTitle && images && images.length && price) {
//             var data = {
//                 index: 'amazonn',
//                 id: asin,
//                 type: 'producttitle',
//                 body: {
//                     "asin": asin,
//                     "title": productTitle,
//                     "price": price,
//                     "images": images,
//                 }
//             }

//             elasticSearch.insertOne(data).then((resp) => {
//             })
//         }

//         await getAnother(page)
//         await page.goto('about:blank')
//         await page.close()
//     } catch (err) {
//         console.log(err)
//     }

// }

// async function scrapeSearch(url, starting, ending) {
//     let page = await browser.newPage()
//     await page.goto(url, { waitUntil: 'domcontentloaded' })

//     var promises1 = []
//     try {
//         asins = await page.evaluate((sel) => {
//             const lis = Array.from(document.querySelectorAll('#atfResults > #s-results-list-atf > li'))
//             return lis.map(li => li.getAttribute('data-asin'))
//         }, '#atfResults')
//         for (var j = 0; j < asins.length; j++) {
//             promises1.push(getProduct(asins[j]))
//         }
//     } catch (err) {
//         console.log(err)
//     }
//     await page.goto('about:blank')
//     await page.close()
//     await Promise.all(promises1)
// }

// async function giveASearch(searchText) {

//     var promises2 = []
//     for (var page = 1; page <= PAGE_LIMIT; page++) {
//         url = SEARCH_URL.replace("(PAGE)", page)
//         url = url.replace("(KEYWORD)", searchText)

//         // promises2.push(scrapeSearch(url, (page-1)*30, page*30))
//         await scrapeSearch(url, (page - 1) * 30, page * 30)
//     }
//     // await Promise.all(promises2)
// }

// // asdf = [
// //     "B00025696C",
// //     "B071J984BV"
// // ]

// async function solve(start, end) {
//     process.setMaxListeners(0)
//     browser = await getDriver()
//     console.log(start, end)

//     // asdf.forEach(item => {
//     //     allAsins.push(item)
//     // });

//     for (var i = start; i <= end; i++) {
//         allAsins.push(ASIN[i].asin)
//     }

//     ind = 0
//     promises = []
//     for (var i = 0; i < allAsins.length; i++) {
//         promises.push(await getProduct(allAsins[i]))
//     }

//     await Promise.all(promises)
//     browser.close()
// }

// // solve(0,1)
// // solve(process.argv[2], process.argv[3])

// app.get("/refresh/:start/:end", function (req, res) {
//     solve(req.params.start, req.params.end)
//     res.send("completed")
// })

// var server = app.listen(8081, function () {
//     var host = server.address().address
//     var port = server.address().port
//     console.log("Listening on ", host, port)
// })


// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//         if ((new Date().getTime() - start) > milliseconds) {
//             break;
//         }
//     }
// }




