import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import UserProvider from "./context/UserProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="*" element={<App />} />
            </Routes>
          </PersistGate>
        </Provider>
      </StrictMode>
    </UserProvider>
  </BrowserRouter>
);
