import ReactDOM from "react-dom/client";

import { MyClasses } from "../components/my-classes";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <MyClasses />
  </AppQueryClientProvider>
);
