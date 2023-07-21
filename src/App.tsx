import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import GlobalStyle from "./styles/globalStyles";

import Category from "./pages/list/Category";
import Notice from "./pages/list/Notice";
import SignIn from "./pages/SignIn";
import Main from "./components/commons/Main";
import Advertisement from "./pages/list/Advertisement";
import Collection from "./pages/list/Collection";
import ColumnCode from "./pages/list/ColumnCode";
import Inquiry from "./pages/list/Inquiry";
import CategoryForm from "./pages/create/CategoryForm";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/notice/write",
        element: <>notice write</>,
      },
      {
        path: "/notice",
        element: <Notice />,
      },
      {
        path: "/category/write",
        element: <CategoryForm />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/advertisement/write",
        element: <>advertisement write</>,
      },
      {
        path: "/advertisement",
        element: <Advertisement />,
      },
      {
        path: "/collection/write",
        element: <>collection write</>,
      },
      {
        path: "/collection",
        element: <Collection />,
      },
      {
        path: "/columnCode/write",
        element: <>collection write</>,
      },
      {
        path: "/columnCode",
        element: <ColumnCode />,
      },
      {
        path: "/inquiry/write",
        element: <>inquiry write</>,
      },
      {
        path: "/inquiry",
        element: <Inquiry />,
      },
      {
        path: "/*",
        element: <>no page</>,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <GlobalStyle />
      <ToastContainer />
    </div>
  );
}

export default App;
