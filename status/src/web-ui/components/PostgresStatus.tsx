import { PostgresStatus as PostgresStatusModel } from "@domain/postgres";
import { LocalStatusView } from "./LocalStatusView";

import { postgresContainerName } from "@domain/postgres"

interface PostgresStatusProps {
  postgres: PostgresStatusModel;
}

export function PostgresStatus({ postgres }: PostgresStatusProps) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5>PostgreSQL Status</h5>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <strong className="me-3">{postgresContainerName}:</strong>
          <LocalStatusView localStatus={postgres.localStatus} />
        </div>
      </div>
    </div>
  );
}
