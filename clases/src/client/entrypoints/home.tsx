import ReactDOM from "react-dom/client";

import { Home } from "../components/home";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <Home />
  </AppQueryClientProvider>
);
