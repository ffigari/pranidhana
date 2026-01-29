import { LocalStatus } from "@domain/app/local-status";

interface LocalStatusViewProps {
  localStatus: LocalStatus;
}

export function LocalStatusView({ localStatus }: LocalStatusViewProps) {
  return (
    <>
      {localStatus.isOk() ? (
        <span className="badge bg-success">Container is running</span>
      ) : (
        <span className="badge bg-danger">Container is not running</span>
      )}
    </>
  );
}
