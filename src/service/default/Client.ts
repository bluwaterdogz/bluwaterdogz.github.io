import { axios } from "../axios";

interface ClientConfig<T> {
  fallbackData?: T[];
  path: string;
}
export default class Client<T> {
  constructor(private config: ClientConfig<T>) {}

  async get(id: string): Promise<T | undefined> {
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

  async list(ids?: string[]): Promise<T[] | undefined> {
    try {
      const res = await axios.get(`${this.config.path}`);
      return res.data || undefined;
    } catch (e) {
      console.warn(`Using Fallback LIST Data for ${this.config.path}`);
      return (
        (await this.config.fallbackData?.filter((item: any) =>
          ids != null ? ids?.includes(item.id) : true
        )) || []
      );
    }
  }
}
