import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import { GlobalStyle } from "./styles/globalStyles";

const router = createBrowserRouter([
  {
    path: "/admin",
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
    </div>
  );
}

export default App;
