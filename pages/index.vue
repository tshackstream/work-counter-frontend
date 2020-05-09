<template>
  <v-layout
      column
      justify-center
  >
    <v-flex
        xs12
        sm8
        md6
    >
      <MonthlyInput @saveToDb="save" :date-info="monthInfo" :is-sp="isSp" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'nuxt-property-decorator';
  import MonthlyInput from "~/components/organisms/MonthlyInput.vue";
  import { sleep } from '~/libs/time';
  import {autoSaveWaitMilliSeconds} from "~/config/app";
  import {calcMonthlyInfo} from "~/libs/work";
  import { Context } from '@nuxt/types';
  import {appStatusStore, dateInfoStore, monthStore, projectStore, statusStore, workTimeStore} from "~/store";

  @Component({
    components: {
      MonthlyInput
    }
  })
  export default class PageIndex extends Vue {
    isSp = this.$vuetify.breakpoint.mdAndDown;

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
        const data = JSON.stringify(dateInfoStore.monthInfo);
        await this.$axios.$put('/api/v1/work_info', data, {headers: {"Content-Type": "application/json"}});
        appStatusStore.setFinishSaving();
      }
    }

    async fetch(context: Context): Promise<void> {
      const {app, store}  = context;

      await appStatusStore.setCurrentProjectId(1);
      await monthStore.getThisMonth();
      await dateInfoStore.getMonthInfo(
        {
          projectId: appStatusStore.currentProjectId,
          year: monthStore.year,
          month: monthStore.month
        });

      await statusStore.getStatus();
      await projectStore.getProjectInfo(appStatusStore.currentProjectId);

      let workRes = await (app.$axios as any).get(
        '/api/v1/monthly_work_result/' +  appStatusStore.currentProjectId + '/' + monthStore.year + '/' + monthStore.month
      );

      if (typeof workRes.data === 'undefined' || workRes.data === null) {
        const baseInfo = {
          id: 0,
          project_id: appStatusStore.currentProjectId,
          month: monthStore.year + '-' + monthStore.month + '-01'
        };
        const calculatedInfo = calcMonthlyInfo(dateInfoStore.monthInfo, projectStore.data);
        if (calculatedInfo !== null) {
          const monthlyInfo = Object.assign(baseInfo, calculatedInfo);
          await workTimeStore.saveWorkTimeInfo(monthlyInfo);
        }
      } else {
        const monthlyInfo = workRes.data;
        await workTimeStore.saveWorkTimeInfo(monthlyInfo);
      }
    }

    mounted(): void {
      this.$store.subscribe(async (mutation, state) => {
        switch (mutation.type) {
          case 'month/changeMonth':
            appStatusStore.setLoading();
            const data = JSON.stringify(dateInfoStore.monthInfo);
            this.$axios.$put('/api/v1/work_info', data, {headers: {"Content-Type": "application/json"}});
            await dateInfoStore.getMonthInfo(
              {
                projectId: appStatusStore.currentProjectId,
                year: monthStore.year,
                month: monthStore.month
            });
            let workRes = await (this as any).$axios.$get(
              '/api/v1/monthly_work_result/' +  appStatusStore.currentProjectId + '/' + monthStore.year + '/' + monthStore.month
            );

            if (typeof workRes === 'undefined' || workRes === null) {
              const baseInfo = {
                id: 0,
                project_id: appStatusStore.currentProjectId,
                month: monthStore.year + '-' + monthStore.month + '-01'
              };
              const calculatedInfo = calcMonthlyInfo(dateInfoStore.monthInfo, projectStore.data);

              if (calculatedInfo !== null) {
                const monthlyInfo = Object.assign(baseInfo, calculatedInfo);
                await workTimeStore.saveWorkTimeInfo(monthlyInfo);
              }
            } else {
              await workTimeStore.saveWorkTimeInfo(workRes);
            }
            appStatusStore.setFinishLoading();
            break;
          case 'project/updateProjectInfo':
          case 'dateInfo/updateMonthInfo':
            const baseInfo = {
              id: workTimeStore.id,
              project_id: appStatusStore.currentProjectId,
              month: monthStore.year + '-' + monthStore.month + '-01',
            };
            const workTimeInfo = Object.assign(baseInfo, calcMonthlyInfo(dateInfoStore.monthInfo, projectStore.data));
            await workTimeStore.saveWorkTimeInfo(workTimeInfo);
            break;
          default:
            break;
        }
      })
    }
  }
</script>
