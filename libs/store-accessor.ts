import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AppStatusStore from "~/store/appStatus";
import DateInfoStore from "~/store/dateInfo";
import ErrorStatusStore from "~/store/errorStatus";
import MonthStore from "~/store/month";
import ProjectStore from "~/store/project";
import StatusStore from "~/store/status";
import WorkTimeStore from "~/store/workTime";

let appStatusStore: AppStatusStore;
let dateInfoStore: DateInfoStore;
let errorStatusStore: ErrorStatusStore;
let monthStore: MonthStore;
let projectStore: ProjectStore;
let statusStore: StatusStore;
let workTimeStore: WorkTimeStore;

function initialiseStores(store: Store<any>): void {
  appStatusStore = getModule(AppStatusStore, store);
  dateInfoStore = getModule(DateInfoStore, store);
  errorStatusStore = getModule(ErrorStatusStore, store);
  monthStore = getModule(MonthStore, store);
  projectStore = getModule(ProjectStore, store);
  statusStore = getModule(StatusStore, store);
  workTimeStore = getModule(WorkTimeStore, store);
}

export {
  initialiseStores,
  appStatusStore,
  dateInfoStore,
  errorStatusStore,
  monthStore,
  projectStore,
  statusStore,
  workTimeStore
}
