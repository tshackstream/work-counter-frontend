type Project = {
  id: number,
  project_name: string,
  reward_type: number,
  lower_limit_time?: number,
  limit_time?: number,
  unit_price?: number,
  over_unit_price?: number,
  deduction_unit_price?: number,
  hourly_wage?: number,
  work_time_per_day: string,
  rest_time: string,
  [key: string]: string|number|undefined
};
export enum RewardType {
  timeRange = 1,
  hourlyWage = 2
}
export default Project;
