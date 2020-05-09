<template>
  <v-container>
    <v-row>
      <v-col><h3>設定</h3></v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-on:change="saveToStore('reward_type', $event)" :value="project.reward_type.toString()">
          <v-radio label="精算幅" value="1" />
          <div class="d-flex flex-row">
            <v-text-field
                v-on:change="saveToStore('lower_limit_time', $event)"
                label="下限(h)"
                :value="project.lower_limit_time"
            />
            <span>～</span>
            <v-text-field
                v-on:change="saveToStore('limit_time', $event)"
                label="上限(h)"
                :value="project.limit_time"
            />
          </div>
          <v-text-field
              v-on:change="saveToStore('unit_price', $event)"
              label="単価"
              :value="project.unit_price"
          />
          <v-text-field
              v-on:change="saveToStore('over_unit_price', $event)"
              label="超過単価(15分単位)"
              :value="project.over_unit_price"
              readonly
          />
          <v-text-field
              v-on:change="saveToStore('deduction_unit_price', $event)"
              label="控除単価(15分単位)"
              :value="project.deduction_unit_price"
              readonly
          />
          <v-radio label="時給" value="2" />
          <v-text-field
              v-on:change="saveToStore('hourly_wage', $event)"
              label="時給"
              :value="project.hourly_wage"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>
          <v-text-field
              v-on:change="saveToStore('work_time_per_day', $event)"
              label="1日の稼働時間(h)"
              placeholder="ex) 8"
              :value="project.work_time_per_day"
          />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'nuxt-property-decorator';
  import {appStatusStore, projectStore} from "~/store";

  @Component
  export default class ProjectSettingForm extends Vue {
    get project() {
      return projectStore.data;
    }

    async saveToStore(key: string, value: any) {
      appStatusStore.setUnderSaving();
      await projectStore.updateProjectInfo({key: key, value: value});
      const data = JSON.stringify(this.project);
      await this.$axios.$put('/api/v1/projects', data, {headers: {"Content-Type": "application/json"}});
      appStatusStore.setFinishSaving();
    }
  }
</script>

<style scoped>

</style>
