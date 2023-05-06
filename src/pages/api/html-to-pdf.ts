import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { html } = req.body;

    try {
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4" });

      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=generated.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.log("Failed to generate PDF", { error });
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  } else {
    res.status(405).json({ error: "Only POST requests are allowed" });
  }
}
