const express = require("express");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");
const app = express();

const passengers = [
  {
    name: "Gabriel",
    flightNumber: 7873,
    time: "18h00",
  },

  {
    name: "Roger",
    flightNumber: 8883,
    time: "18h00",
  },
  {
    name: "Anna",
    flightNumber: 5974,
    time: "18h00",
  },
];

app.get("/pdf", async (request, response) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/", {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: "Letter",
    margin: {
      top: "20px",
      bottom: "40px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();

  response.contentType("application/pdf");

  return response.send(pdf);
});

app.get("/", (request, response) => {
  const filePath = path.join(__dirname, "/print.ejs");
  ejs.renderFile(filePath, { passengers }, (err, data) => {
    if (err) {
      response.send("Erro na leitura do arquivo");
    }

    return response.send(data);
  });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
