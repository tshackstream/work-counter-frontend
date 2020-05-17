export const autoSaveWaitMilliSeconds = 2000;
const API_URL_PREFIX = '/api';
export const API_ENDPOINTS = {
  getStatusList: API_URL_PREFIX + '/status/list',
  getProject: API_URL_PREFIX + '/projects/%(projectId)d',
  saveProject: API_URL_PREFIX + '/projects',
  saveMonthlyWorkResult: API_URL_PREFIX + '/monthly_work_result',
  getMonthlyWorkResult: API_URL_PREFIX + '/monthly_work_result/%(projectId)d/%(year)d/%(month)d',
  getWorkInfoList: API_URL_PREFIX + '/work_info/list/%(projectId)d/%(year)d/%(month)d',
  saveWorkInfo: API_URL_PREFIX + '/work_info',
  downloadWorkSheet: API_URL_PREFIX + '/download/work_sheet/%(projectId)d/%(year)d/%(month)d',
  downloadInvoice: API_URL_PREFIX + '/download/invoice/%(projectId)d/%(year)d/%(month)d',
};
