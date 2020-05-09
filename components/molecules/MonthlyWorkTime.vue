<template>
  <v-col>
    <v-row>
      <v-col><span>今月</span></v-col>
      <v-col><span>{{ workTime }}</span></v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';

  @Component
  export default class MonthlyWorkTime extends Vue {
    @Prop({type: String, required: true}) workTime!: string;
  }
</script>

<style scoped>

</style>