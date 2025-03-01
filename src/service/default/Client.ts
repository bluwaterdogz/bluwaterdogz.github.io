interface ClientConfig<T> {
  data?: T;
  listData?: T[];
}
export default class Client<T> {
  data?: T;
  listData?: T[];

  constructor(config: ClientConfig<T>) {
    this.listData = config.listData;
    this.data = config.data;
  }

  async get(id: string): Promise<T | undefined> {
    return await (this.data || this.listData?.find((x: any) => x.id === id));
  }

  async list(ids?: string[]): Promise<T[] | undefined> {
    return await this.listData?.filter((item: any) =>
      ids != null ? ids?.includes(item.id) : true
    );
  }
}
