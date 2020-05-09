<template>
  <div>
    <AttendanceInput @saveInput="save" v-for="(info, idx) in dateInfo" :key="idx" :info="info" :is-sp="isSp"/>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';
  import { PropOptions } from 'vue';
  import AttendanceInput from "~/components/molecules/AttendanceInput.vue";
  import DateInfo from '~/types/DateInfo';

  @Component({
    components: {
      AttendanceInput
    }
  })
  export default class MonthlyInput extends Vue{
    @Prop({type: Object} as PropOptions<DateInfo>) dateInfo?: Object;
    @Prop({type: Boolean, required: true}) isSp!: boolean;
    save() {
      this.$emit('saveToDb');
    }
  }
</script>

<style scoped>

</style>