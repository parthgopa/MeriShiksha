import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import GenerateMCQs from "./components/GenerateMCQs/GenerateMCQs.jsx";
import ParagraphMCQs from "./components/ParagraphMCQs/ParagraphMCQs.jsx";
import DotPointSummary from "./components/DotPointSummary/DotPointSummary.jsx";
import Home from "./components/Home.jsx";
import TopicLearning from "./components/TopicLearmingFiles/TopicLearning.jsx";
import LearningTopic from "./components/TopicLearmingFiles/LearningTopic.jsx";
import FinishedLearning from "./components/TopicLearmingFiles/FinishedLearning.jsx";
import MCQTest from "./components/TopicLearmingFiles/MCQTest.jsx";
import FinalResult from "./components/TopicLearmingFiles/FinalResult.jsx";
import Questions from "./components/GenerateMCQs/Questions.jsx";
import SummaryPage from "./components/DotPointSummary/summaryPage.jsx";
import FirstPage from "./components/FirstPage.jsx";
import Functionalities from "./components/Functionalities.jsx";
import LessonPage from "./components/LessionPlan/lessonpage.jsx";
import PlannedPage from "./components/LessionPlan/PlannedPage.jsx";
import FlashCard from "./components/FlashCards/Flashcard.jsx";
// import ReviewSection from "./components/Review.jsx";
import Layout from "./components/Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <FirstPage />
      </Layout>
    ),
  },
  {
    path: "/functionalities",
    element: (
      <Layout>
        <Functionalities />
      </Layout>
    ),
  },
  {
    path: "/topic-learning",
    element: (
      <Layout>
        <TopicLearning />{" "}
      </Layout>
    ),
  },
  {
    path: "/learning-topic",
    element: (
      <Layout>
        <LearningTopic />{" "}
      </Layout>
    ),
  },
  {
    path: "/generate-mcqs",
    element: (
      <Layout>
        <GenerateMCQs />{" "}
      </Layout>
    ),
  },
  {
    path: "/paragraph-mcqs",
    element: (
      <Layout>
        <ParagraphMCQs />{" "}
      </Layout>
    ),
  },
  {
    path: "/paragraph-mcqs/mcq-test",
    element: (
      <Layout>
        <MCQTest />{" "}
      </Layout>
    ),
  },
  {
    path: "/dotpoint-summary",
    element: (
      <Layout>
        <DotPointSummary />{" "}
      </Layout>
    ),
  },
  {
    path: "/dotpoint-summary/summary-page",
    element: (
      <Layout>
        <SummaryPage />{" "}
      </Layout>
    ),
  },

  {
    path: "/finished-learning",
    element: (
      <Layout>
        <FinishedLearning />{" "}
      </Layout>
    ),
  },
  {
    path: "/mcq-test",
    element: (
      <Layout>
        <MCQTest />{" "}
      </Layout>
    ),
  },
  {
    path: "/final-result",
    element: (
      <Layout>
        <FinalResult />{" "}
      </Layout>
    ),
  },
  {
    path: "/questions",
    element: (
      <Layout>
        <Questions />{" "}
      </Layout>
    ),
  },
  {
    path: "/lesson-plan",
    element: (
      <Layout>
        <LessonPage />{" "}
      </Layout>
    ),
  },
  {
    path: "/lessonpage/planned-page",
    element: (
      <Layout>
        <PlannedPage />{" "}
      </Layout>
    ),
  },
  {
    path: "/flash-cards",
    element: (
      <Layout>
        <FlashCard />{" "}
      </Layout>
    ),
  },
  // {
  //   path: "/review-section",
  //   element: (
  //     <Layout>
  //       <ReviewSection />{" "}
  //     </Layout>
  //   ),
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// [
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/topic-learning", element: <TopicLearning /> },
//       { path: "/generate-mcqs", element: <GenerateMCQs /> },
//       { path: "/paragraph-mcqs", element: <ParagraphMCQs /> },
//       { path: "/paragraph-mcqs/mcq-test", element: <MCQTest /> },
//       { path: "/dotpoint-summary", element: <DotPointSummary /> },
//       { path: "/dotpoint-summary/summary-page", element: <SummaryPage /> },
//       { path: "/learning-topic", element: <LearningTopic /> },
//       { path: "/finished-learning", element: <FinishedLearning /> },
//       { path: "/mcq-test", element: <MCQTest /> },
//       { path: "/final-result", element: <FinalResult /> },
//       { path: "/generate-mcqs/questions", element: <Questions /> },
//     ],
//   },
// ]
