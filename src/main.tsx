import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ScrollToTop } from "./components/ScrollToTop";
import "./globals.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
<React.StrictMode>
<BrowserRouter>
<ScrollToTop />
<App />
</BrowserRouter>
</React.StrictMode>
);
