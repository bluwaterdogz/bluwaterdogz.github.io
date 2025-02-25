interface ClientConfig<T> {
  data?: T;
  listData?: T[];
}
export default class Client<T> {
  data?: T;
  listData?: T[];
  constructor(config: ClientConfig<T>) {
    this.listData = config.listData;
  }
  async get(): Promise<T | undefined> {
    return await this.data;
  }
  async list(): Promise<T[] | undefined> {
    return await this.listData;
  }
}
