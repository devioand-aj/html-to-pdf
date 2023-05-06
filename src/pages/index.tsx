import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  async function downloadPDF() {
    setIsLoading(true);

    const html = `<html>
      <head>
        <title>Example HTML to PDF</title>
      </head>
      <body>
        <h1>Hello, PDF!</h1>
      </.body>
    </html>`;

    try {
      const response = await fetch("/api/html-to-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false);
  }

  return (
    <div>
      <h1>HTML to PDF Conversion</h1>
      <button onClick={downloadPDF} disabled={isLoading}>
        {isLoading ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
}
