import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import Backend from "~/libs/backend";

export interface IWorkTimeStore {
  id: number,
  project_id: number,
  month: string,
  work_time: string,
  prospected_work_time: string,
  prospected_decimal_work_time: number,
  prospected_reward: number,
  business_day: number,
  input_day: number,
}

@Module({ stateFactory: true, namespaced: true, name: 'workTime' })
export default class WorkTimeStore extends VuexModule implements IWorkTimeStore {
  id: number = 0;
  project_id: number =  0;
  month: string = '';
  work_time: string = '';
  prospected_work_time: string = '';
  prospected_decimal_work_time: number =  0;
  prospected_reward: number =  0;
  business_day: number =  0;
  input_day: number =  0;

  @Mutation
  setWorkTimeInfoMutation(value: IWorkTimeStore): void {
    this.id = value.id;
    this.project_id = value.project_id;
    this.month = value.month;
    this.work_time = value.work_time;
    this.prospected_work_time = value.prospected_work_time;
    this.prospected_decimal_work_time = value.prospected_decimal_work_time;
    this.prospected_reward = value.prospected_reward;
    this.business_day = value.business_day;
    this.input_day = value.input_day;
  }

  @Action
  setWorkTimeInfo(param: IWorkTimeStore) {
    this.setWorkTimeInfoMutation(param);
  }

  @Action
  async saveWorkTimeInfo(param: IWorkTimeStore) {
    const res = await Backend.saveMonthlyWorkResult(param);
    this.setWorkTimeInfoMutation(res);
  }
};
