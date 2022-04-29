<template>
    <component :is="tag !== null ? tag : 'div'" :class="additionalClass">
        <text-field-with-validation
          @input="changeTime(dateId, dateKey + '_hour', $event)"
          :validation-item-name="dispName+'(時)'"
          additionalClass="input-text-center"
          validation-rules="max:2"
          :label="dispName"
          v-model="hour"
        />
      <span>:</span>
      <text-field-with-validation
        @input="changeTime(dateId, dateKey + '_minute', $event)"
        :validation-item-name="dispName+'(分)'"
        additionalClass="input-text-center"
        validation-rules="max:2"
        v-model="minute"
      />
    </component>
</template>

<script lang="ts">
  import {Component, Prop, PropSync, Vue} from 'nuxt-property-decorator';
  import TextFieldWithValidation from "~/components/atoms/TextFieldWithValidation.vue";
  import {dateInfoStore} from "~/store";

    @Component({
      components: {
        TextFieldWithValidation
      }
    }) export default class AttendanceTimeInput extends Vue {
      @Prop({type: Number, required: true}) dateId!: string;
      @Prop({type: String, required: true}) dateKey!: string;
      @Prop({type: String}) tag?: string;
      @Prop({type: String}) additionalClass?: string;
      @Prop({type: String, required: true}) dispName!: string;
      @Prop({type: String}) hourValue?: string;
      @Prop({type: String}) minuteValue?: string;

      get hour() {
        return this.$props.hourValue;
      }

      get minute() {
        return this.$props.minuteValue;
      }

      changeTime(id: number, key: string, event: any) {
        this.$emit('input', {event: event, id: id, key: key})
      }
    }
</script>

<style scoped>

</style>
