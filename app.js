const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
const baseURL = "https://peraturan.go.id";

const scraping = async (url) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);

            const datas = [];

            $("a[href$='.pdf']").each((index, element) => {
                const data = $(element).attr("href");
                datas.push(data)
            });
            
            await Promise.all(datas.map(url => downloadPDF(url))); 
            console.log("All PDFs downloaded successfully");

        } else {
            console.error("Failed to fetch: ", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching data ", error);
    }
}

const downloadPDF = async (url) => {
    try {
        const fileName = url.split("/").pop(); 
        const response = await axios({
            method: 'get',
            url: baseURL + url,
            responseType: 'stream'
        });
        
        if (response.status !== 200) {
            throw new Error(`Failed to download ${fileName} from ${baseURL + url}: ${response.statusText}`);
        }

        const fileStream = fs.createWriteStream(`pdfs/${fileName}`);
        response.data.pipe(fileStream);

        return new Promise((resolve, reject) => {
            fileStream.on('finish', () => {
                console.log(`Downloaded ${fileName}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                console.error(`Error downloading ${fileName}:`, err);
                reject(err);
            });
        });
    } catch (error) {
        console.error("Error downloading PDF: ", error);
    }
}


const pageURL = "https://peraturan.go.id/uu?page=0"

scraping(pageURL);

for (let i = 0; i < 88; i++) {
    const pageURL = "https://peraturan.go.id/uu?page=" + i.toString();
    scraping(pageURL);
}
