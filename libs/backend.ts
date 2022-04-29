import {AxiosResponse} from "axios";
import {sprintf} from "sprintf-js";
import {API_ENDPOINTS} from "~/config/app";
import {$axios} from "./api";
import WorkTime from "~/types/WorkTime";
import Status from "~/types/Status";
import Project from "~/types/Project";
import DateInfo from "~/types/DateInfo";
import MonthInfo from "~/types/MonthInfo";
import {saveAs} from "file-saver";

export default class Backend {
  static getStatusList(): Promise<AxiosResponse<Status[]>> {
    return $axios.get(API_ENDPOINTS.getStatusList, {timeout: 5000});
  }

  static getProject(projectId: number): Promise<AxiosResponse<Project>> {
    return $axios.get(sprintf(API_ENDPOINTS.getProject, {projectId: projectId}), {timeout: 5000});
  }

  static saveProject(project: Project | null): void {
    if (project === null) return;

    const param = JSON.stringify(project);
    $axios.$put(
      API_ENDPOINTS.saveProject,
      param,
      {headers: {"Content-Type": "application/json"}, timeout: 5000}
    );
  }

  static saveMonthlyWorkResult(workTime: WorkTime): Promise<WorkTime> {
    const param = JSON.stringify(workTime);
    return $axios.$post(
      API_ENDPOINTS.saveMonthlyWorkResult,
      param,
      {headers: {"Content-Type": "application/json"}, timeout: 5000}
    );
  }

  static getMonthlyWorkResult(projectId: number, year: number, month: number): Promise<AxiosResponse<WorkTime>> {
    return $axios.get(
      sprintf(
        API_ENDPOINTS.getMonthlyWorkResult,
        {projectId: projectId, year: year, month: month}
      ),
      {timeout: 5000}
    );
  }

  static getWorkInfoList(projectId: number, year: number, month: number): Promise<AxiosResponse<DateInfo[]>> {
    return $axios.get(
      sprintf(
        API_ENDPOINTS.getWorkInfoList,
        {projectId: projectId, year: year, month: month}
      ),
      {timeout: 5000}
    );
  }

  static saveWorkInfo(monthInfo: MonthInfo | null): void {
    if (monthInfo === null) return;

    const param = JSON.stringify(monthInfo);
    $axios.$put(
      API_ENDPOINTS.saveWorkInfo,
      param,
      {headers: {"Content-Type": "application/json"}, timeout: 5000}
    );
  }

  static downloadWorkSheet(projectId: number, year: number, month: number): void {
    $axios.get(
      sprintf(
        API_ENDPOINTS.downloadWorkSheet,
        {projectId: projectId, year: year, month: month}
      ),
    {responseType: 'blob', timeout: 5000}
    )
      .then(res => {
        saveAs(res.data, year.toString() + month.toString() + "勤務表.xlsx");
      });
  }

  static downloadInvoice(projectId: number, year: number, month: number): void {
    $axios.get(
      sprintf(
        API_ENDPOINTS.downloadInvoice,
        {projectId: projectId, year: year, month: month}
      ),
      {responseType: 'blob', timeout: 5000}
    )
      .then(res => {
        saveAs(res.data, year.toString() + month.toString() + "請求書.xlsx");
      });
  }
}
