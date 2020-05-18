<template>
  <validation-provider v-slot="{ errors }" :rules="validationRules" :name="itemName">
    <v-text-field class="input-text-center" v-model="innerValue" :label="label" :name="fieldName" :placeholder="placeholder" />
    <p v-show="errors.length" class="error--text">
      {{ errors[0] }}
    </p>
  </validation-provider>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'nuxt-property-decorator';

  @Component
  export default class TextFieldWithValidation extends Vue {
    @Prop({type: String, required: true}) itemName!: string;
    @Prop({type: String}) label?: string;
    @Prop({type: String, required: true}) validationRules!: string;
    @Prop({type: String}) fieldName?: string;
    @Prop({type: String}) placeholder?: string;
    @Prop({type: String}) value?: string;
    @Prop({type: String}) additionalClass?: string;

    innerValue = ''

    mounted() {
      this.innerValue = this.$props.value;
    }

    @Watch('innervalue')
    onChange(val: string) {
      this.$emit('input', val)
    }
  }
</script>

<style>
  .input-text-center input {
    text-align: center;
  }
</style>
