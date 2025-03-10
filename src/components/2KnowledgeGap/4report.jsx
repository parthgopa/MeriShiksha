import React from "react";
import { useLocation } from "react-router";
import { Pie } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "chart.js/auto";
import HomeButton from "../HomeButton";

const Report = () => {
  const location = useLocation(null);
  const { assessmentData } = location.state;

  const calculateScore = (answers) => {
    let correctCount = 0;
    let totalCount = 0;

    Object.values(answers).forEach((levelAnswers) => {
      levelAnswers.forEach((answer) => {
        if (answer.selectedOption === answer.correctAnswer) {
          correctCount++;
        }
        totalCount++;
      });
    });

    return (correctCount / totalCount) * 100;
  };

  const generateReport = () => {
    const report = [];
    assessmentData.forEach((topicData, topicIndex) => {
      const topicScore = calculateScore(topicData.answers);
      const status = topicScore >= 60 ? "Strong" : "Weak";

      Object.entries(topicData.answers).forEach(([level, levelAnswers]) => {
        levelAnswers.forEach((answer, index) => {
          report.push({
            serial: `${topicIndex + 1}.${level[0].toUpperCase()}${index + 1}`,
            topic: topicData.topic,
            level,
            question: answer.question,
            userAnswer: answer.options[answer.selectedOption],
            correctAnswer: answer.options[answer.correctAnswer],
            status:
              answer.selectedOption === answer.correctAnswer
                ? "Correct"
                : "Incorrect",
          });
        });
      });

      report.push({ topic: topicData.topic, status, topicScore });
    });

    return report;
  };

  const downloadPDF = () => {
    const input = document.getElementById("report");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Report.pdf");
    });
  };

  const report = generateReport();

  const topicScores = assessmentData.map((topicData) =>
    calculateScore(topicData.answers)
  );
  const topicLabels = assessmentData.map((topicData) => topicData.topic);
  const chartData = {
    labels: topicLabels,
    datasets: [
      {
        data: topicScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="container min-h-screen w-screen mx-auto p-6 bg-secondary text-white rounded-lg shadow-lg">
      <div id="report" className="overflow-x-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center text-white">
          Quiz Report
        </h1>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-secondary text-white rounded-lg shadow-md table-auto">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-2 px-4 border border-accent">Serial</th>
                <th className="py-2 px-4 border border-accent">Topic</th>
                <th className="py-2 px-4 border border-accent">Level</th>
                <th className="py-2 px-4 border border-accent">Question</th>
                <th className="py-2 px-4 border border-accent">Your Answer</th>
                <th className="py-2 px-4 border border-accent">
                  Correct Answer
                </th>
                <th className="py-2 px-4 border border-accent">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-secondary odd:bg-secondary even:bg-cardaccent"
                >
                  <td className="py-2 px-4 border border-accent">
                    {row.serial}
                  </td>
                  <td className="py-2 px-4 border border-accent">
                    {row.topic}
                  </td>
                  <td className="py-2 px-4 border border-accent">
                    {row.level}
                  </td>
                  <td className="py-2 px-4 border border-accent">
                    {row.question}
                  </td>
                  <td className="py-2 px-4 border border-accent">
                    {row.userAnswer}
                  </td>
                  <td className="py-2 px-4 border border-accent">
                    {row.correctAnswer}
                  </td>
                  <td
                    className={`py-2 px-4 border border-accent ${
                      row.status === "Correct"
                        ? "text-green-400 font-bold text-xl"
                        : "text-red-500 font-bold text-xl"
                    }`}
                  >
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-white">Topic Status</h3>
        <ul className="space-y-4 mb-6">
          {assessmentData.map((topicData, index) => {
            const topicScore = calculateScore(topicData.answers);
            return (
              <li
                key={index}
                className={`p-4 rounded-lg border border-secondary ${
                  topicScore >= 60
                    ? "bg-green-500 text-white"
                    : "bg-red-400 text-white"
                }`}
              >
                {topicData.topic}: {topicScore >= 60 ? "Strong" : "Weak"}
              </li>
            );
          })}
        </ul>

        <h3 className="text-2xl font-semibold mb-4 text-accent">
          Overall Performance
        </h3>
        <div
          className="chart-container mx-auto mb-8"
          style={{
            width: "40%",
            color: "white",
          }}
        >
<Pie
  data={chartData}
  options={{
    plugins: {
      legend: {
        labels: {
          color: "white", // Change the color of the labels to stand out against the black background
        },
      },
    },
  }}
/>
        </div>
      </div>
      <HomeButton />
    </div>
  );
};

export default Report;
{
  /* <button
        onClick={downloadPDF}
        className="btn btn-dark"
        style={{ position: "absolute", top: "20px", right: "20px" }}
      >
        Download PDF
      </button> */
}
