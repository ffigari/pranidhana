import { AppStatus as AppStatusModel } from "@domain/app";
import { AppStatus } from "./AppStatus";

interface AppsStatusProps {
  apps: AppStatusModel[];
}

export function AppsStatus({ apps }: AppsStatusProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h5>Applications Status</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((appStatus) => (
                <AppStatus key={appStatus.appName} appStatus={appStatus} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
