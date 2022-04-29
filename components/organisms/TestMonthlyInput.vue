<template>
  <validation-observer ref="testAttendanceObserver" v-slot="{ validate }">
    <text-field-with-validation
      @change="save"
      validation-item-name="テスト"
      additionalClass="input-text-center"
      validation-rules="max:5"
      label="test"
      v-model="test"
    />
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
  export default class TestMonthlyInput extends Vue{
    @Prop({type: Boolean, required: true}) isSp!: boolean;

    private test = '';

    get status() {
      return statusStore.status;
    }

    async save(event: any) {
      console.log(event);
      const isValid = await (this.$refs.testAttendanceObserver as any).validate();
      console.log(isValid);
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
