import ReactDOM from "react-dom/client";

import { DojoSignup } from "../components/dojo-signup";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <DojoSignup />
  </AppQueryClientProvider>
);
