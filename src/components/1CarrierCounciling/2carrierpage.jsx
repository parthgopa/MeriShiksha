import React from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router";
import HomeButton from "../HomeButton";

const CareerOutput = () => {
  const location = useLocation(null);
  const { response } = location.state;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(carriercounciling);
    alert("Copied to clipboard");
  };

  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const input = document.getElementById("output-container");
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdfWidth = canvas.width * 0.75; // Convert pixels to points
        const pdfHeight = canvas.height * 0.75; // Convert pixels to points

        // Create the PDF document with custom dimensions
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Carrier Counciling.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
    // alert("Download PDF functionality coming soon");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-2 flex flex-col justify-center items-center gap-8">
      {/* Output Section */}
      <div className="w-full max-w-3xl p-1 lg:p-6 rounded-lg shadow-lg bg-secondary text-white">
        <h2 className="text-3xl text-white font-bold text-center mb-6">
          Career Guidance Output
        </h2>
        <div
          id="output-container"
          className="p-2 lg:p-4 rounded-lg bg-gray-800 text-white "
        >
          <ReactMarkdown children={response} className="max-w-auto" />
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            className="px-6 py-2 btn btn-dark transition-all"
            onClick={handleCopyToClipboard}
          >
            Copy to Clipboard
          </button>
          <button
            className="px-6 py-2 btn btn-dark transition-all"
            onClick={handleDownloadPdf}
          >
            Download PDF
          </button>
        </div>
      </div>
      <HomeButton></HomeButton>
    </div>
  );
};

export default CareerOutput;
