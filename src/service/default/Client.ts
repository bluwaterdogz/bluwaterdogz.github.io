import { axios } from "../axios";
import { DefaultParameters } from "./types";

interface ClientConfig<Entity> {
  fallbackData?: Entity[];
  path: string;
}
export default class Client<
  Entity,
  Parameters extends DefaultParameters = DefaultParameters
> {
  constructor(private config: ClientConfig<Entity>) {}

  async get(id: string): Promise<Entity | undefined> {
    try {
      const res = await axios.get(`${this.config.path}/${id}`);
      return res.data || undefined;
    } catch (e) {
      console.warn(`Using Fallback GET Data for ${this.config.path}`);
      return (
        (await this.config.fallbackData?.find((x: any) => x.id === id)) ||
        undefined
      );
    }
  }

  async list(params?: Parameters): Promise<Entity[] | undefined> {
    try {
      const res = await axios.post(`${this.config.path}`, params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data || undefined;
    } catch (e) {
      console.warn(`Using Fallback LIST Data for ${this.config.path}`);
      return (
        (await this.config.fallbackData?.filter((item: any) =>
          params?.ids != null ? params?.ids?.includes(item.id) : true
        )) || []
      );
    }
  }
}
