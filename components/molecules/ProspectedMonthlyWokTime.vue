<template>
  <v-col>
    <v-row>
      <v-col><span>見込み時間</span></v-col>
      <v-col>
        <span>{{ workTime }}</span>
        <br/>
        <span style="font-size: small">{{ decimalWorkTime }}h</span>
        <br/>
        <span style="font-size: small">(15分単位)</span>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';

  @Component
  export default class ProspectedMonthlyWokTime extends Vue {
    @Prop({type: String, required: true}) workTime!: string;
    @Prop({type: Number, required: true}) decimalWorkTime!: number;
  }
</script>

<style scoped>

</style>