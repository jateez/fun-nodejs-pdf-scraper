// Import required modules
const cheerio = require("cheerio"); // Cheerio for parsing HTML
const fs = require("fs"); // File system module for file operations
const axios = require("axios"); // Axios for making HTTP requests

// Base URL of the website to be scraped
const baseURL = "https://peraturan.go.id";

/**
 * Function to scrape the website for PDF files and download them
 * @param {string} url - The URL of the website to be scraped
 */
const scraping = async (url) => {
    try {
        // Fetch HTML content of the specified URL
        const response = await axios.get(url);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Parse the HTML content using Cheerio
            const html = response.data;
            const $ = cheerio.load(html);

            // Array to store URLs of PDF files found on the webpage
            const datas = [];

            // Extract URLs of PDF files using jQuery-like syntax
            $("a[href$='.pdf']").each((index, element) => {
                const data = $(element).attr("href");
                datas.push(data);
            });

            // Download each PDF file asynchronously
            await Promise.all(datas.map(url => downloadPDF(url))); 
            console.log("All PDFs downloaded successfully");

        } else {
            // Log an error message if the request failed
            console.error("Failed to fetch: ", response.statusText);
        }
    } catch (error) {
        // Log any errors that occur during the scraping process
        console.error("Error fetching data ", error);
    }
}

/**
 * Function to download a PDF file from a given URL
 * @param {string} url - The URL of the PDF file to be downloaded
 */
const downloadPDF = async (url) => {
    try {
        // Extract the file name from the URL
        const fileName = url.split("/").pop(); 

        // Make a GET request to download the PDF file
        const response = await axios({
            method: 'get',
            url: baseURL + url,
            responseType: 'stream'
        });
        
        // Check if the download request was successful
        if (response.status !== 200) {
            // Throw an error if the download failed
            throw new Error(`Failed to download ${fileName} from ${baseURL + url}: ${response.statusText}`);
        }

        // Create a writable stream to save the downloaded file
        const fileStream = fs.createWriteStream(`pdfs/${fileName}`);
        
        // Pipe the response data stream to the file stream
        response.data.pipe(fileStream);

        // Return a promise to handle the completion of the download process
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
        // Log any errors that occur during the download process
        console.error("Error downloading PDF: ", error);
    }
}

// Iterate over additional pages and scrape them
for (let i = 0; i < 88; i++) {
    const pageURL = `https://peraturan.go.id/uu?page=${i}`;
    scraping(pageURL);
}
