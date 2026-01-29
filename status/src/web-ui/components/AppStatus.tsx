import { AppStatus as AppStatusModel } from "@domain/app";
import { LocalStatusView } from "./LocalStatusView";

interface AppStatusProps {
  appStatus: AppStatusModel;
}

export function AppStatus({ appStatus }: AppStatusProps) {
  return (
    <tr>
      <td>{appStatus.appName}</td>
      <td>
        <LocalStatusView localStatus={appStatus.localStatus} />
      </td>
    </tr>
  );
}
