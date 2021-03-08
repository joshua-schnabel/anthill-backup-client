import envalid from "envalid";
import jsYaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import _ from "lodash-es";

const { safeLoad } = jsYaml;
const __dirname = fs.realpathSync("./src/application/configuration/");

export class Config {
  private static instance: Config | null = null;
  private pEnv: envalid.CleanEnv & { readonly [varName: string]: string | undefined };
  private pConfig: Record<string, unknown> | null = null;
  private pDefaultConfig: Record<string, unknown> | null = null;

  private constructor () {
    this.loadEnviroment();
    this.loadYAML();
  }

  public static getInstance (): Config {
    if (Config.instance == null) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getValue (...key: string[]): (string | number | undefined) {
    key = this.getKey(key);
    let value;
    value = this.getEnvConfig(key);
    if (value === undefined) value = this.getConfigConfig(key);
    if (value === undefined) value = this.getDefaultConfig(key);
    return value;
  }

  public env (): envalid.CleanEnv {
    return this.pEnv;
  }

  private loadYAML (): void {
    if (this.pEnv.CONFIGDIR && this.pEnv.CONFIGFILE) {
      const configFilePath = path.resolve(this.pEnv.CONFIGDIR + this.pEnv.CONFIGFILE);
      const defaultConfigFilePath = path.resolve(__dirname, "config.default.yml");

      this.pDefaultConfig = <Record<string, unknown>>safeLoad(fs.readFileSync(path.resolve(defaultConfigFilePath), "utf8"), { filename: configFilePath, json: true });
      if (fs.existsSync(configFilePath)) {
        this.pConfig = <Record<string, unknown>>safeLoad(fs.readFileSync(path.resolve(configFilePath), "utf8"), { filename: configFilePath, json: true });
      }
    }
  }

  private loadEnviroment (): void {
    this.pEnv = envalid.cleanEnv(process.env, {
      "server.port": envalid.port({ default: undefined }),
      CONFIGDIR: envalid.str({ default: "./config/" }),
      CONFIGFILE: envalid.str({ default: "config.yml", devDefault: "config.dev.yml" })
    });
  }

  private getEnvConfig (tkey: string[]): string | undefined {
    return this.pEnv[tkey.join(".")];
  }

  private getConfigConfig (key: string[]): (string | number | undefined) {
    return (this.pConfig !== null) ? this.findRecursiv(this.pConfig, _.cloneDeep(key)) : undefined;
  }

  private getDefaultConfig (key: string[]): (string | number | undefined) {
    return (this.pDefaultConfig !== null) ? this.findRecursiv(this.pDefaultConfig, _.cloneDeep(key)) : undefined;
  }

  private findRecursiv (pConfig: Record<string, unknown>, key: string[]): (string | number | undefined) {
    const ckey = key.shift();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (ckey && Object.prototype.hasOwnProperty.call(pConfig, ckey)) {
      if (key.length > 0) {
        return this.findRecursiv(<Record<string, unknown>> pConfig[ckey], key);
      } else {
        return <(string | number)> pConfig[ckey];
      }
    } else {
      return undefined;
    }
  }

  private getKey (key: string[]): string[] {
    if (key.length === 1 && key[0].includes(".")) { return key[0].split("."); }
    return key;
  }
}

export const CONF = Config.getInstance();
export default Config.getInstance();
