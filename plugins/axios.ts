import { Plugin } from '@nuxt/types';
import {initializeAxios} from "~/libs/api";

const axiosPlugin: Plugin = ({ $axios, store }): void => {
  $axios.onError(error => {
    if (error.response == null) { return }
    store.dispatch('errorStatus/showError', '通信エラーが発生しました。');
    store.dispatch('appStatus/setFinishLoading');
  });
  initializeAxios($axios);
};

export default axiosPlugin;
