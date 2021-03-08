export type Path = string;
export type Repository = string;

export class Retention {
  private readonly keepDaily: number;
  private readonly keepWeekly: number;
  private readonly keepMonthly: number;

  public constructor (keepDaily: number, keepWeekly: number, keepMonthly: number) {
    this.keepDaily = keepDaily;
    this.keepWeekly = keepWeekly;
    this.keepMonthly = keepMonthly;
  }

  public getKeepDaily (): number {
    return this.keepDaily;
  }

  public getKeepWeekly (): number {
    return this.keepWeekly;
  }

  public getKeepMonthly (): number {
    return this.keepMonthly;
  }
}

export default class BackupDescription {
    private readonly sourceDirectories: Path[];
    private readonly repositories: Repository;

    public constructor (sourceDirectories: Path[]) {
      this.sourceDirectories = sourceDirectories;
    }

    public getSourceDirectories (): Path[] {
      return this.sourceDirectories;
    }
}
