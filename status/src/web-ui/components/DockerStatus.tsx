interface DockerStatusProps {
  dockerIsUp: boolean;
}

export function DockerStatus({ dockerIsUp }: DockerStatusProps) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5>Docker Status</h5>
      </div>
      <div className="card-body">
        {dockerIsUp ? (
          <span className="badge bg-success">Docker is running</span>
        ) : (
          <span className="badge bg-danger">Docker is not running</span>
        )}
      </div>
    </div>
  );
}
