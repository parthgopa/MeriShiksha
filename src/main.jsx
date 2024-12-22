import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import GenerateMCQs from "./components/GenerateMCQs/GenerateMCQs.jsx";
import ParagraphMCQs from "./components/ParagraphMCQs/ParagraphMCQs.jsx";
import DotPointSummary from "./components/DotPointSummary/DotPointSummary.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import TopicLearning from "./components/TopicLearmingFiles/TopicLearning.jsx";
import LearningTopic from "./components/TopicLearmingFiles/LearningTopic.jsx";
import FinishedLearning from "./components/TopicLearmingFiles/FinishedLearning.jsx";
import MCQTest from "./components/TopicLearmingFiles/MCQTest.jsx";
import FinalResult from "./components/TopicLearmingFiles/FinalResult.jsx";
import Questions from "./components/GenerateMCQs/Questions.jsx";
import SummaryPage from "./components/DotPointSummary/summaryPage.jsx";
import ForgotPassword from "./components/ForgetPassword.jsx";
import Profile from "./components/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "topic-learning",
        element: <TopicLearning />,
      },
      {
        path: "generate-mcqs",
        element: <GenerateMCQs />,
      },
      {
        path: "paragraph-mcqs",
        element: <ParagraphMCQs />,
      },
      {
        path: "paragraph-mcqs/mcq-test",
        element: <MCQTest />,
      },
      {
        path: "dotpoint-summary",
        element: <DotPointSummary />,
      },
      {
        path: "dotpoint-summary/summary-page",
        element: <SummaryPage />,
      },
      {
        path: "learning-topic",
        element: <LearningTopic />,
      },
      {
        path: "finished-learning",
        element: <FinishedLearning />,
      },
      {
        path: "mcq-test",
        element: <MCQTest />,
      },
      {
        path: "final-result",
        element: <FinalResult />,
      },
      {
        path: "generate-mcqs/questions",
        element: <Questions />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
