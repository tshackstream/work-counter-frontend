<template>
  <v-container>
    <v-row><h3>{{ year }}年{{ month }}月のサマリ</h3></v-row>
    <v-row>
      <InputDayNum
          :business-day="workTime.business_day"
          :input-day="workTime.input_day"
      />
    </v-row>
    <v-row>
      <MonthlyWorkTime :work-time="workTime.work_time"/>
    </v-row>
    <v-row>
      <ProspectedMonthlyWokTime
          :work-time="workTime.prospected_work_time"
          :decimal-work-time="workTime.prospected_decimal_work_time"
      />
    </v-row>
    <v-row>
      <ProspectedMonthlyIncome :income="workTime.prospected_reward" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'nuxt-property-decorator';

  import MonthlyWorkTime from "~/components/molecules/MonthlyWorkTime.vue";
  import ProspectedMonthlyIncome from "~/components/molecules/ProspectedMonthlyIncome.vue";
  import ProspectedMonthlyWokTime from "~/components/molecules/ProspectedMonthlyWokTime.vue";
  import InputDayNum from "~/components/molecules/InputDayNum.vue";
  import {monthStore, workTimeStore} from "~/store";

  @Component({
    components: {
      MonthlyWorkTime,
      ProspectedMonthlyWokTime,
      ProspectedMonthlyIncome,
      InputDayNum
    }
  })
  export default class VerticalCalculatedInfo extends Vue{
    get month() {
      return monthStore.month;
    }

    get year() {
      return monthStore.year;
    }

    get workTime() {
      return workTimeStore
    }
  }
</script>

<style scoped>

</style>
