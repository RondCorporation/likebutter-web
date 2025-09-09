import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./screens/Main";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);
