import DateInfo, {WorkStatus} from "~/types/DateInfo";
import Project, {RewardType} from "~/types/Project";
import {timeStrToSec, formatTime, formatDecimalTime, getDate} from "~/libs/time";

export function calcMonthlyInfo(workInfo: {[id: number]: DateInfo} | null, projectInfo: Project | null) {
  if (workInfo === null || projectInfo === null) return null;

  let actualTotalTime = 0;
  let prospectedTotalTime = 0;
  let businessDay = 0;
  let inputDay = 0;
  Object.entries(workInfo).forEach(
    ([key, datum]) => {
      const isHoliday = datum.day_of_week.match((/[土|日]/)) || datum.is_holiday;
      let total = datum.total;

      if (datum.status === WorkStatus.absence) {
        businessDay++;
        inputDay++;
        return;
      }
      if (isHoliday && (total === null || total === '00:00' || typeof total === 'undefined')) return;

      if (total === null || typeof total === 'undefined') {
        total = ('0' + projectInfo.work_time_per_day).slice(-2) + ':00';
      } else {
        // 時間が入力されている場合は実働時間の合計に足す
        actualTotalTime += timeStrToSec(total);
        inputDay++;
      }
      // 未入力も含めて見込み時間として合計する
      prospectedTotalTime += timeStrToSec(total);
      businessDay++;
    }
  );

  const prospectedTotalDecimalTime = formatDecimalTime(prospectedTotalTime, 15);
  let reward = 0;
  switch (projectInfo.reward_type) {
    case RewardType.timeRange:
      if (projectInfo.lower_limit_time === null || typeof projectInfo.lower_limit_time === 'undefined'
        || projectInfo.limit_time === null || typeof projectInfo.limit_time === 'undefined'
        || projectInfo.unit_price === null || typeof projectInfo.unit_price === 'undefined'
        || projectInfo.over_unit_price === null || typeof projectInfo.over_unit_price === 'undefined'
        || projectInfo.deduction_unit_price === null || typeof projectInfo.deduction_unit_price === 'undefined'
      ) {
        break;
      }
      if (prospectedTotalDecimalTime >= projectInfo.lower_limit_time && prospectedTotalDecimalTime <= projectInfo.limit_time) {
        reward = projectInfo.unit_price;
      } else if (prospectedTotalDecimalTime < projectInfo.lower_limit_time) {
        reward = Math.floor(projectInfo.unit_price - (projectInfo.lower_limit_time - prospectedTotalDecimalTime) * projectInfo.deduction_unit_price);
      } else if (prospectedTotalDecimalTime > projectInfo.limit_time) {
        reward = Math.floor(projectInfo.unit_price + (projectInfo.limit_time - prospectedTotalDecimalTime) + projectInfo.over_unit_price);
      }
      break;
    case RewardType.hourlyWage :
      if (projectInfo.hourly_wage === null || typeof projectInfo.hourly_wage === 'undefined') break;
      reward = Math.floor(projectInfo.hourly_wage * prospectedTotalDecimalTime);
      break;
    default:
      break;
  }
  return {
    work_time: formatTime(actualTotalTime),
    prospected_work_time: formatTime(prospectedTotalTime),
    prospected_decimal_work_time: prospectedTotalDecimalTime,
    prospected_reward: reward,
    business_day: businessDay,
    input_day: inputDay,
  };
}

export function calcDeduction(key:string, state: Project, value: Number|null|undefined) {
  let unit_price: Number|null|undefined;
  let limit_time: Number|null|undefined;
  let lower_limit_time: Number|null|undefined;

  switch (key) {
    case 'unit_price':
      unit_price = value;
      limit_time = state.limit_time;
      lower_limit_time = state.lower_limit_time;
      break;
    case 'limit_time':
      unit_price = state.unit_price;
      limit_time = value;
      lower_limit_time = state.lower_limit_time;
      break;
    case 'lower_limit_time':
      unit_price = state.unit_price;
      limit_time = state.limit_time;
      lower_limit_time = value;
      break;
    default:
      return {deduction_unit_price: 0, over_unit_price: 0};
  }

  if (unit_price === null || typeof unit_price === 'undefined'
      || limit_time === null || typeof limit_time === 'undefined'
      || lower_limit_time === null || typeof lower_limit_time === 'undefined'
  ) return {deduction_unit_price: 0, over_unit_price: 0};
  return {
    deduction_unit_price: Math.floor(Math.floor(Number(unit_price)/Number(lower_limit_time))/10)*10,
    over_unit_price: Math.floor(Math.floor(Number(unit_price)/Number(limit_time))/10)*10,
  }
}
