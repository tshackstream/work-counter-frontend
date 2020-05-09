import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

interface IMonthStore {
  year: number,
  month: number
}


@Module({ stateFactory: true, namespaced: true, name: 'month' })
export default class MonthStore extends VuexModule implements IMonthStore {
  year: number = 0;
  month: number = 0;

  @Mutation
  changeMonth (value: IMonthStore): void {
    this.year = value.year;
    this.month = value.month;
  }

  @Action
  getThisMonth() {
    const month = new Date();
    this.changeMonth({year: month.getFullYear(), month: month.getMonth() + 1});
  }

  @Action
  setMonth(date: IMonthStore) {
    const month = new Date(date.year, date.month -1);
    this.changeMonth({year: month.getFullYear(), month: month.getMonth() + 1});
  }

  @Action
  nextMonth() {
    const month = new Date(this.year, this.month - 1, 1);
    month.setMonth(month.getMonth() + 1);
    this.changeMonth({year: month.getFullYear(), month: month.getMonth() + 1});
  }

  @Action
  prevMonth() {
    const month = new Date(this.year, this.month - 1, 1);
    month.setMonth(month.getMonth() - 1);
    this.changeMonth({year: month.getFullYear(), month: month.getMonth() + 1});
  }
};
