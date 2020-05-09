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
      <v-col lg="1">
        <v-text-field v-on:change="save(info.id, 'start', $event)" label="出勤時間" :value="info.start" />
      </v-col>
      <v-col lg="1">
        <v-text-field v-on:change="save(info.id, 'end', $event)" label="退勤時間" :value="info.end" />
      </v-col>
      <v-col lg="1">
        <v-text-field v-on:change="save(info.id, 'rest', $event)" label="休憩時間" :value="info.rest" />
      </v-col>
      <v-col lg="1">
        <v-text-field
            v-on:change="save(info.id, 'total', $event)"
            label="実働時間"
            :value="(info.start === null || info.start === '')
              && (info.end === null || info.end === '')
              && (info.rest === null || info.rest === '')
              ? null : info.total"
            readonly>
        </v-text-field>
      </v-col>
      <v-col v-if="!isSp">
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
</style>
