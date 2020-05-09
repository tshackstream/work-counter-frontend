type DateInfo = {
  id: number,
  project_id: number,
  date: string,
  day_of_week: string,
  is_holiday: boolean,
  holiday_note?: string,
  status?: number,
  start?: string,
  end?: string,
  rest?: string,
  total?: string,
  note?: string,
  [key: string]: string|number|boolean|undefined
};

export enum WorkStatus {
  attendance = 1,
  absence = 2
}

export default DateInfo;
