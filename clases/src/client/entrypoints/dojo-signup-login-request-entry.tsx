import ReactDOM from "react-dom/client";

import { DojoSignupLoginRequest } from "../components/dojo-signup-login-request";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <DojoSignupLoginRequest />
  </AppQueryClientProvider>
);
