<template>
  <div>
    <v-row>
      <v-col lg="2">
        <span>{{ dateFormat }}</span>
        (<span :class="holidayColor">{{ info.day_of_week }}</span>)
      </v-col>
      <v-col lg="3" v-if="info.is_holiday">
        <span class="sunday-or-holiday">{{ info.holiday_note }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="1">
        <v-select
            v-on:change="save(info.id, 'status', $event)"
            label="状態"
            :items="status"
            item-text="label"
            item-value="value"
            :value="info.status"
        />
      </v-col>
      <v-col class="time-input">
        <text-field-with-validation item-name="出勤" additionalClass="input-text-center" validation-rules="max:2" @change="save(info.id, 'start_hour', $event)" label="出勤" :value="startHour" />
        <span>:</span>
        <text-field-with-validation item-name="start_minute" validation-rules="max:2" @change="save(info.id, 'start_minute', $event)" :value="startMinute" />
      </v-col>
      <v-col class="time-input">
        <text-field-with-validation item-name="end_hour" validation-rules="max:2" @change="save(info.id, 'end_hour', $event)" label="退勤" :value="endHour" />
        <span>:</span>
        <text-field-with-validation item-name="end_minute" validation-rules="max:2" @change="save(info.id, 'end_minute', $event)" :value="endMinute" />
      </v-col>
      <v-col class="time-input">
        <text-field-with-validation item-name="rest_hour" validation-rules="max:2" @change="save(info.id, 'rest_hour', $event)" label="休憩" :value="restHour" />
        <span>:</span>
        <text-field-with-validation item-name="rest_minute" validation-rules="max:2" @change="save(info.id, 'rest_minute', $event)" :value="restMinute" />
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
      <v-col lg="6" v-if="!isSp">
        <v-text-field v-on:change="save(info.id, 'note', $event)" label="備考" :value="info.note" />
      </v-col>
    </v-row>
    <v-row v-if="isSp" no-gutters>
      <v-col>
        <v-text-field v-on:change="save(info.id, 'note', $event)" label="備考" :value="info.note" />
      </v-col>
    </v-row>
    <v-divider />
  </div>
</template>

<script lang="ts">
  import { PropOptions } from 'vue';
  import {Component, Prop, Vue} from 'nuxt-property-decorator';
  import DateInfo from "~/types/DateInfo";
  import {statusStore, dateInfoStore} from "~/store";
  import TextFieldWithValidation from "~/components/atoms/TextFieldWithValidation.vue";

  @Component({
    components: {
      TextFieldWithValidation
    }
  })
  export default class AttendanceInput extends Vue {
    @Prop({type: Object} as PropOptions<DateInfo>) info?: Object;
    @Prop({type: Boolean, required: true}) isSp!: boolean;

    get startHour() {
      if (this.$props.info.start === null || this.$props.info.start.length === 0) return this.$props.info.start;
      return this.$props.info.start.split(':')[0];
    }

    get startMinute() {
      if (this.$props.info.start === null || this.$props.info.start.length === 0) return this.$props.info.start;
      return this.$props.info.start.split(':')[1];
    }

    get endHour() {
      if (this.$props.info.end === null || this.$props.info.end.length === 0) return this.$props.info.end;
      return this.$props.info.end.split(':')[0];
    }

    get endMinute() {
      if (this.$props.info.end === null || this.$props.info.end.length === 0) return this.$props.info.end;
      return this.$props.info.end.split(':')[1];
    }

    get restHour() {
      if (this.$props.info.rest === null || this.$props.info.rest.length === 0) return this.$props.info.rest;
      return this.$props.info.rest.split(':')[0];
    }

    get restMinute() {
      if (this.$props.info.rest === null || this.$props.info.rest.length === 0) return this.$props.info.rest;
      return this.$props.info.rest.split(':')[1];
    }

    get status() {
      return statusStore.status;
    }

   private get holidayColor(): string {
      if (this.$props.info.is_holiday || this.$props.info.day_of_week === '日') {
        return 'sunday-or-holiday';
      }

      if (this.$props.info.day_of_week === '土') {
        return 'saturday';
      }

      return '';
    }

    private get dateFormat(): string {
      const date = new Date(this.$props.info.date);
      return (date.getMonth() + 1) + '/' + date.getDate();
    }

    save(id: number, key: string, event: any) {
     dateInfoStore.updateMonthInfo({id: id, key: key, value: event});
      // 親コンポーネントのイベントを発火する
      this.$emit('saveInput');
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
