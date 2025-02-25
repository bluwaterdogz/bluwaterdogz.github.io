import Client from "./Client";

export default class Service<T, C extends Client<T>> {
  constructor(private client: C) {}
  async get() {
    return await this.client.get();
  }
  async list() {
    return await this.client.list();
  }
}
