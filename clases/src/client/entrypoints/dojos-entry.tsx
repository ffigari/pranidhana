import ReactDOM from "react-dom/client";

import { Dojos } from "../components/dojos";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <Dojos />
  </AppQueryClientProvider>
);
