import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import UserProvider from "./context/UserProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <StrictMode>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </StrictMode>
    </UserProvider>
  </BrowserRouter>
);
