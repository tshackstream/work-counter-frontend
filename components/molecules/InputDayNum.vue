<template>
  <v-col>
    <v-row>
      <v-col><span>入力営業日</span></v-col>
      <v-col><span>{{ inputDay }}/{{ businessDay }}日</span></v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';

  @Component
  export default class InputDayNum extends Vue{
    @Prop({type: Number, required: true}) businessDay!: number;
    @Prop({type: Number, required: true}) inputDay!: number;
  }
</script>

<style scoped>

</style>