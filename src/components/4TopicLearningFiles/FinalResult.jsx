import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown"; // Add this import
import HomeButton from "../HomeButton";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinalResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) {
    navigate("/topic-learning");
    return null;
  }
  const { userAnswers, correctAnswers, questions, topic, level } =
    location.state;
  const top = topic;
  const lev = level;

  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState({});
  const [retakeQuiz, setRetakeQuiz] = useState(false);
  const retakeQuizRef = useRef(null);
  const retakemcqs = useRef("");
  const explanationRef = useRef(null); // Ref to the explanation section

  const calculateScore = () => {
    let score = 0;
    Object.keys(userAnswers).forEach((key) => {
      if (userAnswers[key] === correctAnswers[key]) {
        score += 1;
      }
    });
    return score;
  };

  const handleDescriptionFetch = async (questionKey, question, correctAnswer) => {
    setLoadingQuestions((prev) => ({ ...prev, [questionKey]: true }));
    setSelectedDescription(null);

    const prompt = `
      For the following question and its answer, provide a clear and concise explanation for why the correct answer is correct (if possible then give an example). Keep the explanation short and to the point.

      Question: ${question}
      Correct Answer: ${correctAnswer}.
    `;

    await APIService({
      question: prompt,
      onResponse: (response) => {
        if (response.error) {
          setSelectedDescription(response.error);
        } else {
          setSelectedDescription(
            response["candidates"][0]["content"]["parts"][0]["text"]
          );
        }
        setLoadingQuestions((prev) => ({ ...prev, [questionKey]: false }));
        setLoading(false);
        setTimeout(
          () => explanationRef.current.scrollIntoView({ behavior: "smooth" }),
          100
        );
      },
    });
  };

  const score = calculateScore();
  const totalQuestions = Object.keys(correctAnswers).length;
  const incorrectAnswers = totalQuestions - score;

  const data = {
    labels: ["Correct Answers", "Wrong Answers"],
    datasets: [
      {
        data: [score, incorrectAnswers],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#c82333"],
      },
    ],
  };

  const handleReTakeQuiz = () => {
    setRetakeQuiz(!retakeQuiz);
    if (!retakeQuiz) {
      setTimeout(
        () => retakeQuizRef.current.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  };

  const handleStartQuizClick = (event) => {
    event.preventDefault();
    let retakeMCQs = retakemcqs.current.value;
    if (retakeMCQs) {
      const data = {
        topic: top,
        level: lev,
        numMCQs: retakeMCQs,
        comingfrom: "RetakeMCQs",
      };
      navigate("/mcq-test", { state: data });
    } else {
      alert("Specify number of MCQs to Generate");
    }
  };

  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const input = document.getElementById("Container");

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdfWidth = canvas.width * 0.75;
        const pdfHeight = canvas.height * 0.75;

        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Flash Card.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div
      className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex flex-col items-center space-y-12"
      id="Container"
    >
      <h2
        className="text-2xl font-bold text-center text-white mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        MCQ Test Result
      </h2>

      {/* Pie Chart */}
      <div className="w-full mx-auto sm:w-1/2 md:w-1/3 lg:w-1/4">
        <div className="relative" style={{ paddingBottom: "100%" }}>
          <div className="absolute top-0 left-0 w-full h-full">
            <Pie data={data} />
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold">
          <strong>You Scored:</strong> {score} / {totalQuestions}
        </p>
        <p className="text-md">
          <strong className="text-green-500">Correct:</strong> {score} |{" "}
          <strong className="text-red-500">Incorrect:</strong>{" "}
          {incorrectAnswers}
        </p>
      </div>

      {/* Evaluation Table */}
      <div className="w-full overflow-x-auto">
        <h3 className="text-xl font-bold text-center mb-4 text-white">
          Detailed Evaluation
        </h3>
        <table className="table-auto w-full text-left bg-secondary rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">Sr No.</th>
              <th className="px-4 py-2">Question</th>
              <th className="px-4 py-2">Your Answer</th>
              <th className="px-4 py-2">Correct Answer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {Object.keys(questions).map((key, index) => (
              <tr key={index} className="odd:bg-gray-800 even:bg-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{questions[key]}</td>
                <td
                  className={`px-4 py-2 ${
                    userAnswers[key] === correctAnswers[key]
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {userAnswers[key] || "No Answer"}
                </td>
                <td className="px-4 py-2">{correctAnswers[key]}</td>
                <td className="px-4 py-2">
                  {userAnswers[key] === correctAnswers[key] ? (
                    <span className="text-green-500">Correct</span>
                  ) : (
                    <span className="text-red-500">Incorrect</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {userAnswers[key] !== correctAnswers[key] && (
                    <button
                      className="btn btn-success hover:bg-green-600"
                      onClick={() =>
                        handleDescriptionFetch(
                          key, // The question key
                          questions[key], // The question
                          correctAnswers[key] // The correct answer
                        )
                      }
                    >
                      {loadingQuestions[key] ? "Please Wait..." : "Explain"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Description */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        selectedDescription && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-center text-white">
              Explanation
            </h3>
            <div ref={explanationRef} className="p-4 bg-gray-600 rounded-lg">
              <ReactMarkdown
                className="prose prose-sm text-white"
                children={selectedDescription}
              />
            </div>
          </div>
        )
      )}

      {/* Navigation Buttons */}
      <div className="flex space-x-4 bg-gray-600">
        <button
          className="btn btn-info hover:bg-gray-600"
          onClick={handleReTakeQuiz}
        >
          Retake Quiz
        </button>
        {/* <button
          className="btn btn-info hover:bg-gray-800"
          onClick={handleDownloadPdf}
        >
          Download PDF
        </button> */}
      </div>

      {retakeQuiz && (
        <form
          className="mt-6 space-y-4 bg-gray-600 p-4 rounded-lg"
          ref={retakeQuizRef}
          onSubmit={handleStartQuizClick}
        >
          <h5 className="text-lg font-medium">
            How many MCQs you want to generate? (max 10)
          </h5>
          <input
            type="number"
            max="10"
            min="1"
            ref={retakemcqs}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-accent focus:outline-none"
          />
          <div className="flex items-center justify-center">
            <button className="btn btn-dark hover:bg-gray-800 mt-2">
              Start Quiz
            </button>
          </div>
        </form>
      )}
      <HomeButton />
    </div>
  );
};

export default FinalResult;
