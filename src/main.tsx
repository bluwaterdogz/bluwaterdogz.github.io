import "./styles/styles.scss";
import "./styles/theme.scss";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";

const root = document.getElementById("root");

document.querySelector("html")!.classList.add("theme-light");
//   if (faqToggle.classList.contains("faq-display")) {
//     faqToggle.classList.remove("faq-display");
//     // alert("remove faq display!");
//   } else {
//     faqToggle.classList.add("faq-display");
//     // alert("add faq display!");
//   }
ReactDOM.createRoot(root!).render(<RouterProvider router={router} />);
