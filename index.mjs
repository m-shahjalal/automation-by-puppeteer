import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({
    headless: true,
    userDataDir: './user_data',
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1024 });
await page.goto('https://softzino.com/about', { waitUntil: 'networkidle2', timeout: 999999999 });

const team = await page.$$eval('.team-info', (data) =>
    data.map((item) => {
        const name = item.querySelector('.team-name').textContent.replace(/\n/g, '').trim();
        const designation = item.querySelector('.team-designation').textContent.replace(/\n/g, '').trim();
        const image = item.previousElementSibling.children[0].src;
        return { name, designation, image };
    })
);

fs.writeFile('data/team.json', JSON.stringify(team, null, 2), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
browser.close();
