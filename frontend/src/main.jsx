import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UdemyApp from "./udemyApp/index.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Main Newone App */}
          <Route path="/*" element={<App />} />

          {/* Udemy App (second project) */}
          <Route path="/udemy/*" element={<UdemyApp />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
