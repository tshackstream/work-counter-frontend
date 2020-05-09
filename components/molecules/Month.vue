<template>
  <v-row>
    <v-col><v-btn text @click="prevMonth()"><v-icon>mdi-chevron-left</v-icon></v-btn></v-col>
    <v-col>{{ year }}年{{ month }}月</v-col>
    <v-col><v-btn text @click="nextMonth()"><v-icon>mdi-chevron-right</v-icon></v-btn></v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Vue} from 'nuxt-property-decorator';
  import {monthStore} from "~/store";

  @Component
  export default class Month extends Vue{
    get year() {
      return monthStore.year;
    }

    get month() {
      return monthStore.month;
    }

    prevMonth() {
      monthStore.prevMonth();
    }

    nextMonth() {
      monthStore.nextMonth();
    }
  }
</script>

<style scoped>

</style>
