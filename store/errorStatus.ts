// cf. https://qiita.com/yoshinbo/items/1400f6ff181bd9697f47

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import {sleep} from "~/libs/time";

interface IErrorStatusStore {
  message: string,
  isActive: boolean
}

@Module({ stateFactory: true, namespaced: true, name: 'errorStatus' })
export default class ErrorStatusStore extends VuexModule implements IErrorStatusStore {
  message: string = '';
  isActive: boolean = false;

  @Mutation
  setMessage(value: string) {
    this.message = value
  }

  @Mutation
  activate() {
    this.isActive = true;
  }

  @Mutation
  deactivate() {
    this.isActive = false;
  }

  @Action
    async showError(message: string) {
    this.setMessage(message);
    this.activate();
    await sleep(3000);
    this.deactivate();
    this.setMessage('');
  }
};
