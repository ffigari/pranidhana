import { useState, useEffect } from "react";
import { Status } from "@domain/status";
import { api } from "./api";
import { DockerStatus } from "./components/DockerStatus";
import { PostgresStatus } from "./components/PostgresStatus";
import { AppsStatus } from "./components/AppsStatus";

export function App() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await api.getStatus();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Status Monitor</h1>

      {loading && (
        <div className="alert alert-info" role="alert">
          Loading status...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      {!loading && !error && status && (
        <>
          <DockerStatus dockerIsUp={status.dockerIsUp} />
          {status.postgres && <PostgresStatus postgres={status.postgres} />}
          {status.appsStatuses && status.appsStatuses.length > 0 && (
            <AppsStatus apps={status.appsStatuses} />
          )}
        </>
      )}
    </div>
  );
}
