import { NuxtAxiosInstance } from '@nuxtjs/axios'

let $axios: NuxtAxiosInstance;

export function initializeTimeUtils(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
}

export { $axios };
