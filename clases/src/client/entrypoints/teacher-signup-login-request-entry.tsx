import ReactDOM from "react-dom/client";

import { TeacherSignupLoginRequest } from "../components/teacher-signup-login-request";
import { AppQueryClientProvider } from "../shared/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppQueryClientProvider>
    <TeacherSignupLoginRequest />
  </AppQueryClientProvider>
);
