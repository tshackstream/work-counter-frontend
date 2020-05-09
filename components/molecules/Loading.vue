<template>
    <span>
      <v-progress-circular
        indeterminate
        color="primary"
      />
      {{ text }}
    </span>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';

  @Component
  export default class Loading extends Vue {
    @Prop({type: String}) text?: string;
  }
</script>

<style scoped>

</style>
