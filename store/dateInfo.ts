import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import DateInfo from "~/types/DateInfo";
import {calcDailyTotal} from "~/libs/time";
import {$axios} from "~/libs/api";
import MonthInfo from "~/types/MonthInfo";
import Backend from "~/libs/backend";

interface IDateInfoStore {
  monthInfo: MonthInfo | null
}

interface updateParam {
  id: number
  key: string
  value: string|number|boolean|undefined
}

@Module({ stateFactory: true, namespaced: true, name: 'dateInfo' })
export default class DateInfoStore extends VuexModule implements IDateInfoStore {
  monthInfo: MonthInfo | null = null;

  private timeKeys = ['start_hour', 'start_minute', 'end_hour', 'end_minute', 'rest_hour', 'rest_minute'];

  @Mutation
  setMonthInfo (value: DateInfo[]): void {
    this.monthInfo = value;
  }

  @Mutation
  updateMonthInfoMutation(param: updateParam) {
    if (this.monthInfo === null || typeof this.monthInfo === "undefined") return;
    if (this.timeKeys.includes(param.key) && typeof param.value === 'string') {
      this.monthInfo[param.id].total = calcDailyTotal(param.key, this.monthInfo[param.id], param.value)
    }
    this.monthInfo[param.id][param.key] = param.value;
  }

  @Action
  async getMonthInfo(params: {projectId: number, year: number, month: number}) {
    const res = await Backend.getWorkInfoList(params.projectId, params.year, params.month);

    this.setMonthInfo(res.data);
  }

  @Action
  updateMonthInfo(param: updateParam) {
    this.updateMonthInfoMutation(param);
  }
};


