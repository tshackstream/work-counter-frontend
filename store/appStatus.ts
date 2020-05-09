// 更新予定日時を保持する

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import '~/config/app';
import {autoSaveWaitMilliSeconds} from "~/config/app";

interface IAppStatusStore {
  updateTime: number
  underSaving: boolean
  currentProjectId: number
  loading: boolean
}

@Module({ stateFactory: true, namespaced: true, name: 'appStatus' })
export default class AppStatusStore extends VuexModule implements IAppStatusStore {
    updateTime: number = 0;
    underSaving: boolean = false;
    currentProjectId: number = 0;
    loading: boolean = false;

  @Mutation
  setUpdateTimeMutation(value: number): void {
    this.updateTime = value;
  }
  @Mutation
  setUnderSavingMutation(value: boolean): void {
    this.underSaving = value;
  }

  @Mutation
  setCurrentProjectIdMutation(value: number): void {
    this.currentProjectId = value;
  }

  @Mutation
  setLoadingMutation(value: boolean): void {
    this.loading = value;
  }

  @Action
  setUpdateTime() {
    const updateTime = new Date();
    updateTime.setMilliseconds((updateTime.getMilliseconds() + autoSaveWaitMilliSeconds));
    this.setUpdateTimeMutation(updateTime.getTime());
  }

  @Action
  setUnderSaving() {
    this.setUnderSavingMutation(true);
  }

  @Action
  setFinishSaving() {
    this.setUnderSavingMutation(false);
  }

  @Action
  setCurrentProjectId(projectId: number) {
    this.setCurrentProjectIdMutation(projectId);
  }

  @Action
  setLoading() {
    this.setLoadingMutation(true);
  }

  @Action
  setFinishLoading() {
    this.setLoadingMutation(false);
  }
}
