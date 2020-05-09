import { Plugin } from '@nuxt/types';

declare module 'vue/types/vue' {
  interface Vue {
    $timeUtils: {
      sleep(milliseconds: number): Promise<void>
    }
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $timeUtils: {
      sleep(milliseconds: number): Promise<void>
    }
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $timeUtils: {
      sleep(milliseconds: number): Promise<void>
    }
  }
}

const sleep = (milliseconds: number): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });
};

const timeUtilsPlugin: Plugin = (context, inject) => {
  inject('timeUtils', {sleep: sleep})
};

export default timeUtilsPlugin;