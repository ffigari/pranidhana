import ReactDOM from "react-dom/client";

import { Dojo } from "../components/dojo";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <Dojo />
  </AppQueryClientProvider>
);
