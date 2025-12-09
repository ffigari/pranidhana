import ReactDOM from "react-dom/client";

import { Login } from "../components/login";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <Login />
  </AppQueryClientProvider>
);
