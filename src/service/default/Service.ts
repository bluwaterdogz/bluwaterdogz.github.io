import Client from "./Client";

export default class Service<T, C extends Client<T>> {
  constructor(private client: C) {}

  async get(id: string) {
    return await this.client.get(id);
  }

  async list() {
    return await this.client.list();
  }
}
