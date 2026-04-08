import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { QueryProvider } from "./app/providers/QueryProvider.jsx";
import { router } from "./app/router/router.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
);
