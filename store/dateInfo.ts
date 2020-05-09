import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import DateInfo from "~/types/DateInfo";
import {calcDailyTotal} from "~/libs/time";
import {$axios} from "~/libs/api";

interface IDateInfoStore {
  monthInfo: {[id: number]: DateInfo} | null
}

interface updateParam {
  id: number
  key: string
  value: string|number|boolean|undefined
}

@Module({ stateFactory: true, namespaced: true, name: 'dateInfo' })
export default class DateInfoStore extends VuexModule implements IDateInfoStore {
  monthInfo: {[id: number]: DateInfo} | null = null;

  @Mutation
  setMonthInfo (value: DateInfo[]): void {
    this.monthInfo = value;
  }

  @Mutation
  updateMonthInfoMutation(param: updateParam) {
    if (this.monthInfo === null || typeof this.monthInfo === "undefined") return;
    if ((param.key === 'start' || param.key === 'end' || param.key === 'rest') && typeof param.value === 'string') {
      this.monthInfo[param.id].total = calcDailyTotal(param.key, this.monthInfo[param.id], param.value)
    }
    this.monthInfo[param.id][param.key] = param.value;
  }

  @Action
  async getMonthInfo(params: {projectId: number, year: number, month: number}) {
    const res = await $axios.$get(
      '/api/v1/work_info/list/' + params.projectId + '/' + params.year + '/' + params.month)
    ;
    this.setMonthInfo(res);
  }

  @Action
  updateMonthInfo(param: updateParam) {
    this.updateMonthInfoMutation(param);
  }
};


