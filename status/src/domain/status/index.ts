import { AppStatus, AppStatusDTO, parseAppStatusDTO } from "@domain/app";
import { PostgresStatus, PostgresStatusDTO, parsePostgresStatusDTO } from "@domain/postgres";

export interface StatusDTO {
  dockerIsUp: boolean;
  postgres: PostgresStatusDTO | null;
  apps: AppStatusDTO[] | null;
}

export class Status {
  constructor(
    public dockerIsUp: boolean,
    public postgres: PostgresStatus | null,
    public appsStatuses: AppStatus[] | null
  ) {}

  toDTO(): StatusDTO {
    return {
      dockerIsUp: this.dockerIsUp,
      postgres: this.postgres?.toDTO() ?? null,
      apps: this.appsStatuses?.map((app) => app.toDTO()) ?? null,
    };
  }
}

export const parseStatusDTO = (dto: StatusDTO): Status => {
  return new Status(
    dto.dockerIsUp,
    dto.postgres ? parsePostgresStatusDTO(dto.postgres) : null,
    dto.apps ? dto.apps.map(parseAppStatusDTO) : null
  );
};
