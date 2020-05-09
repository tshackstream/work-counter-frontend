// cf https://kotaeta.com/59568935

import DateInfo from "~/types/DateInfo";

export function sleep(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });
}


export function timeStrToSec(timeStr: string) {
  const parts = timeStr.split(":");
  return (Number(parts[0]) * 3600) +
    (Number(parts[1]) * 60);
}

export function pad(num: number):string {
  if(num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}

export function formatTime(seconds: number):string {
  return [pad(Math.floor(seconds/3600)),
    pad(Math.floor(seconds/60)%60),
  ].join(":");
}

export function formatDecimalTime(seconds: number, floorNum: number):number {
  let minute =  Math.floor(seconds/60)%60;
  minute = Math.floor(minute/floorNum) * 0.25;
  return Math.floor(seconds/3600) + minute;
}

export function calcDailyTotal(key: string, monthInfo: DateInfo, value: string):string|undefined {
  let start: Date|null;
  let end: Date|null;
  let rest: string|undefined;
  switch (key) {
    case 'start':
      start = getDate(value);
      end = getDate(monthInfo.end);
      rest = monthInfo.rest;
      break;
    case 'end':
      start = getDate(monthInfo.start);
      end = getDate(value);
      rest = monthInfo.rest;
      break;
    case 'rest':
      start = getDate(monthInfo.start);
      end = getDate(monthInfo.end);
      rest = value;
      break;
    default:
      return monthInfo.total;
  }

  if (start === null || end === null || rest === null || typeof rest === 'undefined') return monthInfo.total;

  const totalUnixTime = end.getTime() - start.getTime();
  if (totalUnixTime < 0) return monthInfo.total;
  const diffHour = totalUnixTime / (1000 * 60 * 60);
  const diffMinute = (diffHour - Math.floor(diffHour)) * 60;

  const totalWithoutRest = ('00' + Math.floor(diffHour)).slice(-2) + ':' + ('00' + Math.floor(diffMinute)).slice(-2);

  if (totalWithoutRest === '00:00' || rest === '00:00') return totalWithoutRest;

  const totalDate = new Date('2019/01/01 ' + totalWithoutRest);

  // 休憩時間抜きで25時間以上働くと実働時間がNaNになる
  // そのケースはないと思いたいのでその場合は実働時間をそのまま返す
  if (totalDate.toString() === 'Invalid Date') return monthInfo.total;

  const restArr = rest.split(':');
  totalDate.setHours(totalDate.getHours() - Number(restArr[0]));
  totalDate.setMinutes(totalDate.getMinutes() - Number(restArr[1]));

  return ('0' + totalDate.getHours()).slice(-2) + ':' + ('0' + totalDate.getMinutes()).slice(-2);
}

export function getDate(value: string|undefined):Date|null {
  if (value === null || typeof value === 'undefined') return  null;
  let date = '2019/01/01 ';
  const hourArr = value.split(':');
  let hour = Number(hourArr[0]);
  if (hour >= 24 && hour < 48) {
    date = '2019/01/02 ';
    hour = hour - 24;
    value = ('0' + hour).slice(-2) + value.substr(2,3)
  } else if (hour >= 48) {
    return null;
  }

  return new Date(date + value);
}