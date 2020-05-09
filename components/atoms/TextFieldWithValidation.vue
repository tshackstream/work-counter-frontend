<template>
  <validation-provider v-slot="{ errors }" :rules="validationRules" :name="itemName">
    <v-text-field v-model="textValue" :label="itemName" :name="fieldName" :placeholder="placeholder" />
    <p v-show="errors.length" class="error--text">
      {{ errors[0] }}
    </p>
  </validation-provider>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'nuxt-property-decorator';

  @Component
  export default class TextFieldWithValidation extends Vue {
    @Prop({type: String, required: true}) itemName!: string;
    @Prop({type: String}) label?: string;
    @Prop({type: String, required: true}) validationRules!: string;
    @Prop({type: String}) fieldName?: string;
    @Prop({type: String}) placeholder?: string;
    @Prop({type: String}) value?: string;

    get textValue() {
      return this.$props.value;
    }

    set textValue(val) {
      this.$emit('input', val)
    }
  }
</script>

<style scoped>

</style>