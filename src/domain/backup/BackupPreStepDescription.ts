export type Name = string;

export default abstract class BackupPreStepDescription {
    private readonly name: Name;
    private readonly settings: Map<string, string | number>;

    public constructor (name: Name, settings: Map<string, string | number>) {
      this.name = name;
      this.settings = settings;
    }

    public getName (): Name {
      return this.name;
    }

    public getSettings (): Map<string, string | number> {
      return this.settings;
    }

    abstract checkSettings (): void;
}
