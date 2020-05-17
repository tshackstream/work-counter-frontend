<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="hidden-md-and-down">{{ title }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn small :disabled="workSheetProcessing" color="primary" @click="downloadWorkSheet">勤務表出力</v-btn>
      </v-col>
      <v-col>
        <v-btn small :disabled="invoiceProcessing" color="primary" @click="downloadInvoice">請求書出力</v-btn>
      </v-col>
    </v-row>
    <v-date-picker
        :value="year.toString() + '-' + ('0' + month.toString()).slice(-2)"
        type="month"
        locale="ja"
        no-title
        width="100%"
        style="margin-top: 1em;"
        @click:month="setMonth"
    />
    <VerticalCalculatedInfo />
    <v-divider />
    <ProjectSettingForm />
    <v-divider />
  </v-container>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';
  import VerticalCalculatedInfo from "~/components/molecules/VerticalCalculatedInfo.vue";
  import ProjectSettingForm from "~/components/molecules/ProjectSettingForm.vue";
  import { saveAs } from 'file-saver';
  import { monthStore, appStatusStore } from "~/store";
  import Backend from "~/libs/backend";

  @Component({
    components: {
      VerticalCalculatedInfo,
      ProjectSettingForm,
    },
  })
  export default class Sidebar extends Vue {
    @Prop({type: String, required: true}) title!: string;
    workSheetProcessing = false;
    invoiceProcessing = false;

    get month() {
      return monthStore.month;
    }

    get year() {
      return monthStore.year;
    }

    setMonth(date: string) {
      const split = date.split('-');
      monthStore.setMonth({year: Number(split[0]), month: Number(split[1])});
    }

    // cf https://qiita.com/koushisa/items/ac908d81361534264d35
    async downloadWorkSheet() {
      this.workSheetProcessing = true;
      await Backend.downloadWorkSheet(
        appStatusStore.currentProjectId,
        monthStore.year,
        monthStore.month
      );
      this.workSheetProcessing = false;
    }

    async downloadInvoice() {
      this.invoiceProcessing = true;
      await Backend.downloadInvoice(
        appStatusStore.currentProjectId,
        monthStore.year,
        monthStore.month
      );
      this.invoiceProcessing = false;
    }
  }
</script>

<style scoped>

</style>
