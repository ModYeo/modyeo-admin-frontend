import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import GlobalStyle from "./styles/globalStyles";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/admin/*",
    element: <Admin />,
  },
  {
    path: "/*",
    element: <SignIn />,
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
