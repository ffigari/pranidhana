import ReactDOM from "react-dom/client";

import { TeacherSignup } from "../components/teacher-signup";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <TeacherSignup />
  </AppQueryClientProvider>
);
