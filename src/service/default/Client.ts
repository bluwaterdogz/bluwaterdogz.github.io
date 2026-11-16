import { axios } from "../axios";
import { DefaultParameters, Identifiable } from "./types";

interface ClientConfig<Entity> {
  fallbackData?: Entity[];
  path: string;
}
export default class Client<
  Entity extends Identifiable,
  Parameters extends DefaultParameters = DefaultParameters
> {
  private useApi = false;
  constructor(private config: ClientConfig<Entity>) {}

  public async get(id: string): Promise<Entity | undefined> {
    if (this.useApi) {
      try {
        const res = await axios.get(`${this.config.path}/${id}`);
        return res.data || undefined;
      } catch {
        return this.fetchGetFallbackData(id);
      }
    } else {
      return this.fetchGetFallbackData(id);
    }
  }

  private async fetchGetFallbackData(id: string): Promise<Entity | undefined> {
    // console.warn(`Using Fallback GET Data for ${this.config.path}`);
    return (
      (await this.config.fallbackData?.find(
        (entity) => String(entity.id) === id
      )) ||
      undefined
    );
  }

  public async list(params?: Parameters): Promise<Entity[]> {
    if (this.useApi) {
      try {
        const res = await axios.post(`${this.config.path}`, params, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data || [];
      } catch {
        return this.fetchListFallbackData(params);
      }
    } else {
      return this.fetchListFallbackData(params);
    }
  }

  private async fetchListFallbackData(params?: Parameters): Promise<Entity[]> {
    // console.warn(`Using Fallback LIST Data for ${this.config.path}`);
    const filterIds = (entity: Entity) =>
      params?.ids != null ? params.ids.includes(String(entity.id)) : true;
    const result = await this.config.fallbackData?.filter(filterIds);
    return result || [];
  }
}
