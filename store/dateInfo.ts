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
    const res = await Backend.getWorkInfoList(params.projectId, params.year, params.month);

    this.setMonthInfo(res.data);
  }

  @Action
  updateMonthInfo(param: updateParam) {
    this.updateMonthInfoMutation(param);
  }
};


