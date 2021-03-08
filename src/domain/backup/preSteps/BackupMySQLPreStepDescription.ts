import BackupPreStepDescription, { Name as PreStepName } from "../BackupPreStepDescription";

export type Topic = string;
export type Content = string;

export default class BackupMySQLPreStepDescription extends BackupPreStepDescription {
  public constructor (name: PreStepName, settings: Map<string, string | number>) {
    super(name, settings);
  }

  private checkSettings (): void {
    throw new Error("Method not implemented.");
  }
}
