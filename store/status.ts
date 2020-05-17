import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import Backend from "~/libs/backend";

export interface IStatusStore {
  status: {'label': string, 'value': number}[] | null
}

@Module({ stateFactory: true, namespaced: true, name: 'status' })
export default class StatusStore extends VuexModule implements IStatusStore {
  status: {'label': string, 'value': number}[] | null = null;

  @Mutation
  setStatus (value: {'label': string, 'value': number}[]): void {
    this.status = value;
  }

  @Action
  async getStatus() {
    const res = await Backend.getStatusList();
    let list = [{'label': "", 'value': 0}];
    list = list.concat(res.data);
    this.setStatus(list);
  }
};
