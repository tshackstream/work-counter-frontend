<template>
  <v-col>
    <v-row>
      <v-col><span>見込み収入</span></v-col>
      <v-col><span>{{ numberFormat }}</span></v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';

  @Component
  export default class ProspectedMonthlyIncome extends Vue {
    @Prop({type: Number, required: true}) income!: number;

    private get numberFormat(): string {
      const formatter = new Intl.NumberFormat(
        'ja-JP',
        {
          style: 'currency',
          currency: 'JPY'
        }
      );
      return formatter.format(this.$props.income)
    }
  }
</script>

<style scoped>

</style>