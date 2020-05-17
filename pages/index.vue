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
      <MonthlyInput :is-sp="isSp" />
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
  import Backend from "~/libs/backend";

  @Component({
    components: {
      MonthlyInput
    }
  })
  export default class PageIndex extends Vue {
    isSp = this.$vuetify.breakpoint.mdAndDown;

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

      let workRes = await Backend.getMonthlyWorkResult(
        appStatusStore.currentProjectId,
        monthStore.year,
        monthStore.month
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
            await Backend.saveWorkInfo(dateInfoStore.monthInfo);
            await dateInfoStore.getMonthInfo(
              {
                projectId: appStatusStore.currentProjectId,
                year: monthStore.year,
                month: monthStore.month
            });

            let workRes = await Backend.getMonthlyWorkResult(
              appStatusStore.currentProjectId,
              monthStore.year,
              monthStore.month
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
              await workTimeStore.saveWorkTimeInfo(workRes.data);
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
