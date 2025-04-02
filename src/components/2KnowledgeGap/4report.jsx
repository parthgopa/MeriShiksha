import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Pie } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "chart.js/auto";
import HomeButton from "../HomeButton";
import { FaDownload, FaCheckCircle, FaTimesCircle, FaChartPie } from "react-icons/fa";

const Report = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
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
      pdf.save("Knowledge_Gap_Report.pdf");
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
          "#36A2EB", // Blue
          "#4BC0C0", // Teal
          "#9966FF", // Purple
          "#FF6384", // Pink
          "#FFCE56", // Yellow
          "#FF9F40", // Orange
          "#8dd3c7", // Mint
          "#bebada", // Lavender
          "#fb8072", // Salmon
          "#80b1d3", // Light Blue
          "#fdb462", // Light Orange
          "#b3de69", // Light Green
        ],
        borderWidth: 0,
      },
    ],
  };

  // Calculate overall score
  const overallScore = topicScores.reduce((sum, score) => sum + score, 0) / topicScores.length;
  const overallStatus = overallScore >= 60 ? "Strong" : "Needs Improvement";

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div id="report" className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Knowledge Gap Assessment Report
            </h1>
            
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
            >
              <FaDownload className="text-[var(--accent-teal)]" />
              <span>Download PDF</span>
            </button>
          </div>
          
          {/* Overall Score Card */}
          <div className={`mb-8 p-6 rounded-xl ${
            overallStatus === "Strong" 
              ? "bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30" 
              : "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                <p className="text-lg">
                  Your knowledge assessment shows an overall score of <span className="font-bold">{overallScore.toFixed(1)}%</span>
                </p>
                <p className="text-lg mt-1">
                  Status: <span className={`font-bold ${overallStatus === "Strong" ? "text-green-400" : "text-orange-400"}`}>
                    {overallStatus}
                  </span>
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                {overallStatus === "Strong" ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
                    <FaCheckCircle className="text-green-400 text-xl" />
                    <span className="font-medium">Well Done!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-lg">
                    <FaTimesCircle className="text-orange-400 text-xl" />
                    <span className="font-medium">Focus on weak areas</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Chart and Topic Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <div className="bg-[var(--primary-black)]/40 p-6 rounded-xl border border-[var(--accent-teal)]/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaChartPie className="text-[var(--accent-teal)]" />
                <span>Topic Performance</span>
              </h3>
              <div className="relative" style={{ height: "300px" }}>
                <Pie 
                  data={chartData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: 'white',
                          font: {
                            size: 12
                          },
                          padding: 10
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Topic Status */}
            <div className="bg-[var(--primary-black)]/40 p-6 rounded-xl border border-[var(--accent-teal)]/10">
              <h3 className="text-xl font-bold mb-4">Topic Status</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {assessmentData.map((topicData, index) => {
                  const topicScore = calculateScore(topicData.answers);
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg flex justify-between items-center ${
                        topicScore >= 60
                          ? "bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30"
                          : "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{topicData.topic}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-full bg-[var(--primary-black)]/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${topicScore >= 60 ? "bg-green-500" : "bg-orange-500"}`}
                              style={{ width: `${topicScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-16 text-right">{topicScore.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className={`ml-4 px-3 py-1 rounded-lg text-sm font-medium ${
                        topicScore >= 60 ? "bg-green-500/30 text-green-300" : "bg-orange-500/30 text-orange-300"
                      }`}>
                        {topicScore >= 60 ? "Strong" : "Weak"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Detailed Evaluation */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Detailed Evaluation</h3>
            <div className="bg-[var(--primary-black)]/40 p-4 rounded-xl border border-[var(--accent-teal)]/10 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Question</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Your Answer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Correct Answer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {report.filter(row => row.serial).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[var(--primary-black)]/20" : "bg-[var(--primary-black)]/40"}>
                      <td className="px-4 py-3 whitespace-nowrap">{row.serial}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{row.topic}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{row.level}</td>
                      <td className="px-4 py-3">{row.question}</td>
                      <td className="px-4 py-3">{row.userAnswer}</td>
                      <td className="px-4 py-3">{row.correctAnswer}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.status === "Correct" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {row.status === "Correct" ? (
                            <FaCheckCircle className="mr-1" />
                          ) : (
                            <FaTimesCircle className="mr-1" />
                          )}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="bg-[var(--primary-black)]/40 p-6 rounded-xl border border-[var(--accent-teal)]/10 mb-4">
            <h3 className="text-xl font-bold mb-4">Recommendations</h3>
            <ul className="space-y-2 list-disc list-inside text-gray-200">
              {assessmentData
                .filter(topicData => calculateScore(topicData.answers) < 60)
                .map((topicData, index) => (
                  <li key={index}>
                    Focus on improving your knowledge of <span className="text-[var(--accent-teal)] font-medium">{topicData.topic}</span>
                  </li>
                ))}
              {assessmentData.filter(topicData => calculateScore(topicData.answers) < 60).length === 0 && (
                <li>Great job! Continue to maintain your strong knowledge across all topics.</li>
              )}
              <li>Review the questions you answered incorrectly to better understand the concepts.</li>
              <li>Consider taking the assessment again after studying to track your progress.</li>
            </ul>
          </div>
        </div>
        
        {/* Home Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default Report;
