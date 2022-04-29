<template>
  <v-app dark>
    <!-- スマホ,タブレットでは表示しない -->
    <v-navigation-drawer
        v-model="drawer"
        fixed
        touchless
        app
    >
      <Sidebar :title="title" />
    </v-navigation-drawer>
    <v-app-bar
        fixed
        flat
        app
        :extended="$vuetify.breakpoint.mdAndDown"
    >
      <v-app-bar-nav-icon class="hidden-lg-and-up"  @click.stop="drawer = !drawer" />
      <v-spacer />
      <Month class="hidden-md-and-down" />
      <v-spacer />
      <template v-slot:extension v-if="$vuetify.breakpoint.mdAndDown">
        <Month />
      </template>
    </v-app-bar>
    <v-content>
      <div style="position: relative">
        <Loading class="loader" text="保存中..." v-show="appStatus.underSaving" />
        <Loading class="loader" text="読込中..." v-show="appStatus.loading" />
      </div>
      <v-container fluid>
        <v-dialog v-model="errorDialog" max-width="290">
          <v-card class="error text-center">
            <span class="white--text">{{ errorMessage }}</span>
          </v-card>
        </v-dialog>
        <v-row>
          <v-col>
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
      <v-footer>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'nuxt-property-decorator';
  import VerticalCalculatedInfo from "~/components/molecules/VerticalCalculatedInfo.vue";
  import ProspectedMonthlyIncome from "~/components/molecules/ProspectedMonthlyIncome.vue";
  import Month from "~/components/molecules/Month.vue";
  import Sidebar from "~/components/organisms/Sidebar.vue";
  import Loading from "~/components/molecules/Loading.vue";
  import {appStatusStore, errorStatusStore, projectStore} from "~/store";
  import {Context} from "@nuxt/types";

  @Component({
    components: {
      VerticalCalculatedInfo,
      ProspectedMonthlyIncome,
      Month,
      Sidebar,
      Loading,
    },
  })
  export default class extends Vue {
      title= '勤怠管理';
      drawer = this.$vuetify.breakpoint.mdAndUp;

      get errorMessage() {
        return errorStatusStore.message;
      }

      get appStatus() {
        return appStatusStore;
      }

      private get errorDialog() {
        return errorStatusStore.isActive;
      }
  }
</script>

<style scoped>
  #app {
    font-family: "Noto Sans JP", "sans-serif";
    -webkit-font-smoothing: antialiased;
    font-weight: 400;
    font-feature-settings: "palt";
  }
  .loader {
    position: absolute;
    top: 0;
    left: 47%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
  }
</style>
