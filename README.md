# PDF Scraper

This is a one-sitting-fun-project-scripts that scrapes PDF files from a website (my case was https://peraturan.go.id) and downloads them locally. It utilizes Node.js with Cheerio for HTML parsing and Axios for making HTTP requests.

## Features

- Scrapes PDF files from a specified website
- Downloads the scraped PDF files locally
- Supports asynchronous scraping and downloading

## Requirements

- Node.js installed on your machine
- npm (Node Package Manager) for installing dependencies

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies.

## Usage

1. Modify the `scraping` function in `app.js` accrodingly to your website and specify the URL of the website you want to scrape.
2. Run the script using `node app.js` or `npm run start`.
3. The script will scrape the website for PDF files and download them to the `pdfs` directory.

## Configuration

- You can adjust the scraping logic and file download directory in `app.js`.
- Customize error handling and logging as needed for your use case.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

