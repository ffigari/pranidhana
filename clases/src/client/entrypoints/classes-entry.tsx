import ReactDOM from "react-dom/client";

import { Classes } from "../components/classes";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <Classes />
  </AppQueryClientProvider>
);
