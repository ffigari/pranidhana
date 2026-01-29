export interface LocalStatusDTO {
  containerIsUp: boolean;
}

export class LocalStatus {
  constructor(public containerIsUp: boolean) {}

  isOk(): boolean {
    return this.containerIsUp;
  }

  toDTO(): LocalStatusDTO {
    return {
      containerIsUp: this.containerIsUp,
    };
  }
}

export const parseLocalStatusDTO = (dto: LocalStatusDTO): LocalStatus => {
  return new LocalStatus(dto.containerIsUp);
};
