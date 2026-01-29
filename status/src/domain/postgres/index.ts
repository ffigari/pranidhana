import { LocalStatus, LocalStatusDTO, parseLocalStatusDTO } from "@domain/app/local-status";

import { ContainerName } from "@domain/docker"

export const postgresContainerName: ContainerName = "pranidhana-postgres"

export interface PostgresStatusDTO {
  localStatus: LocalStatusDTO;
}

export class PostgresStatus {
  constructor(public localStatus: LocalStatus) {}

  toDTO(): PostgresStatusDTO {
    return {
      localStatus: this.localStatus.toDTO(),
    };
  }
}

export const parsePostgresStatusDTO = (dto: PostgresStatusDTO): PostgresStatus => {
  return new PostgresStatus(parseLocalStatusDTO(dto.localStatus));
};
