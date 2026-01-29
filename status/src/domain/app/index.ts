import { LocalStatus, LocalStatusDTO, parseLocalStatusDTO } from "./local-status";

export type AppName = string;

export interface AppDTO {
  name: string;
}

export interface AppStatusDTO {
  appName: AppName;
  localStatus: LocalStatusDTO;
}

export class AppStatus {
  constructor(
    public appName: AppName,
    public localStatus: LocalStatus
  ) {}

  isOK(): boolean {
    return this.localStatus.isOk();
  }

  toDTO(): AppStatusDTO {
    return {
      appName: this.appName,
      localStatus: this.localStatus.toDTO(),
    };
  }
}

export const parseAppStatusDTO = (dto: AppStatusDTO): AppStatus => {
  return new AppStatus(dto.appName, parseLocalStatusDTO(dto.localStatus));
};
