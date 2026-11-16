import Client from "./Client";
import { DefaultParameters, Identifiable } from "./types";

export default class Service<
  Entity extends Identifiable,
  ClientI extends Client<Entity>,
  Parameters extends DefaultParameters = DefaultParameters
> {
  constructor(private client: ClientI) {}

  async get(id: string) {
    return await this.client.get(id);
  }

  async list(params?: Parameters) {
    return await this.client.list(params);
  }
}
