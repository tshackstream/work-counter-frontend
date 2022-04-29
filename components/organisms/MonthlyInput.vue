<template>
  <validation-observer ref="attendanceObserver" v-slot="{ validate }">
    <div :key="idx" v-for="(info, idx) in monthInfo">
      <v-row>
        <v-col lg="2">
          <span>{{ dateFormat(info) }}</span>
          (<span :class="holidayColor(info)">{{ info.day_of_week }}</span>)
        </v-col>
        <v-col lg="3" v-if="info.is_holiday">
          <span class="sunday-or-holiday">{{ info.holiday_note }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="1">
          <v-select
            @change="storeAndSave(info.id, 'status', $event)"
            label="状態"
            :items="status"
            item-text="label"
            item-value="value"
            :value="info.status"
          />
        </v-col>
        <v-col lg="2">
          <attendance-time-input
            @input="save"
            tag="span"
            :date-id="info.id"
            date-key="start"
            additional-class="time-input"
            disp-name="出勤"
            :hour-value="info.start_hour"
            :minute-value="info.start_minute" />
        </v-col>
        <v-col lg="2">
          <attendance-time-input
            @input="save"
            tag="span"
            :date-id="info.id"
            date-key="end"
            additional-class="time-input"
            disp-name="退勤"
            :hour-value="info.end_hour"
            :minute-value="info.end_minute" />
        </v-col>
        <v-col lg="2">
          <attendance-time-input
            @input="save"
            tag="span"
            :date-id="info.id"
            date-key="rest"
            additional-class="time-input"
            disp-name="休憩"
            :hour-value="info.rest_hour"
            :minute-value="info.rest_minute" />
        </v-col>
        <v-col lg="1">
          <v-text-field
            v-on:change="save(info.id, 'total', $event)"
            label="実働"
            :value="(info.start === null || info.start === '')
              && (info.end === null || info.end === '')
              && (info.rest === null || info.rest === '')
              ? null : info.total"
            readonly>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field v-on:change="save(info.id, 'note', $event)" label="備考" :value="info.note" />
        </v-col>
      </v-row>
      <v-divider />
    </div>
  </validation-observer>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';
  import AttendanceInput from "~/components/molecules/AttendanceInput.vue";
  import {appStatusStore, dateInfoStore, statusStore} from "~/libs/store-accessor";
  import {sleep} from "~/libs/time";
  import {autoSaveWaitMilliSeconds} from "~/config/app";
  import Backend from "~/libs/backend";
  import TextFieldWithValidation from "~/components/atoms/TextFieldWithValidation.vue";
  import AttendanceTimeInput from "~/components/molecules/AttendanceTimeInput.vue";
  import DateInfo from "~/types/DateInfo";

  @Component({
    components: {
      TextFieldWithValidation,
      AttendanceTimeInput,
    }
  })
  export default class MonthlyInput extends Vue{
    @Prop({type: Boolean, required: true}) isSp!: boolean;

    get monthInfo() {
      return dateInfoStore.monthInfo;
    }
    get status() {
      return statusStore.status;
    }

    holidayColor(info: DateInfo): string {
      if (info.is_holiday || info.day_of_week === '日') {
        return 'sunday-or-holiday';
      }

      if (info.day_of_week === '土') {
        return 'saturday';
      }

      return '';
    }

    dateFormat(info: DateInfo): string {
      const date = new Date(info.date);
      return (date.getMonth() + 1) + '/' + date.getDate();
    }

    storeAndSave(id: number, key: string, event: any) {
      dateInfoStore.updateMonthInfo({id: id, key: key, value: event});
        // appStatusStore.setUpdateTime();
        // await sleep(autoSaveWaitMilliSeconds);
        // const currentDate = new Date();
        // // 最終入力日時より現在日時の方が後だったら処理実行
        // // 例えば入力後設定秒数以内に別の入力があった場合は処理しない
        // if (currentDate.getTime() > appStatusStore.updateTime) {
        //   appStatusStore.setUnderSaving();
        //   await Backend.saveWorkInfo(dateInfoStore.monthInfo);
        //   appStatusStore.setFinishSaving();
        // }
    }

    async save(event: any) {
      console.log(event);
      const isValid = await (this.$refs.attendanceObserver as any).validate();
      console.log(isValid);
      dateInfoStore.updateMonthInfo({id: event.id, key: event.key, value: event.event});
    }
  }
</script>

<style scoped>
  .sunday-or-holiday {
    color: #ff363b;
  }
  .saturday {
    color: #4c53ff;
  }

  .time-input {
    display: flex;
    align-items: baseline;
  }
</style>
