<template>
  <validation-provider v-slot="{ errors }" :rules="validationRules" :name="validationItemName" :vid="vid">
    <v-text-field
      :class="additionalClass"
      v-model="innerValue"
      :label="label"
      :name="fieldName"
      :placeholder="placeholder"
    />
    <p v-show="dispError && errors.length" class="error--text">
      {{ errors[0] }}
    </p>
  </validation-provider>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'nuxt-property-decorator';

  @Component
  export default class TextFieldWithValidation extends Vue {
    @Prop({type: String, required: true}) validationItemName!: string;
    @Prop({type: String}) label?: string;
    @Prop({type: String, required: true}) validationRules!: string;
    @Prop({type: String}) fieldName?: string;
    @Prop({type: String}) placeholder?: string;
    @Prop({type: String}) value?: string;
    @Prop({type: String}) additionalClass?: string;
    @Prop({type: Boolean, default: true}) dispError!: boolean;
    @Prop({type: String}) vid?: string;


    get innerValue() {
      return this.$props.value;
    }

    set innerValue(val) {
      this.$emit('input', val);
    }
  }
</script>

<style>
  .input-text-center input {
    text-align: center;
  }
</style>
