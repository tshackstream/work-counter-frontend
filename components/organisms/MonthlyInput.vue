<template>
  <div>
    <validation-observer v-slot="{ validate }">
      <AttendanceInput @saveInput="save" v-for="(info, idx) in monthInfo" :key="idx" :info="info" :is-sp="isSp"/>
    </validation-observer>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';
  import AttendanceInput from "~/components/molecules/AttendanceInput.vue";
  import {appStatusStore, dateInfoStore} from "~/libs/store-accessor";
  import {sleep} from "~/libs/time";
  import {autoSaveWaitMilliSeconds} from "~/config/app";
  import Backend from "~/libs/backend";
  import TextFieldWithValidation from "~/components/atoms/TextFieldWithValidation.vue";

  @Component({
    components: {
      TextFieldWithValidation,
      AttendanceInput
    }
  })
  export default class MonthlyInput extends Vue{
    @Prop({type: Boolean, required: true}) isSp!: boolean;
    get monthInfo() {
      return dateInfoStore.monthInfo;
    }

    async save() {
      appStatusStore.setUpdateTime();
      await sleep(autoSaveWaitMilliSeconds);
      const currentDate = new Date();
      // 最終入力日時より現在日時の方が後だったら処理実行
      // 例えば入力後設定秒数以内に別の入力があった場合は処理しない
      if (currentDate.getTime() > appStatusStore.updateTime) {
        appStatusStore.setUnderSaving();
        await Backend.saveWorkInfo(dateInfoStore.monthInfo);
        appStatusStore.setFinishSaving();
      }
    }
  }
</script>

<style scoped>

</style>
