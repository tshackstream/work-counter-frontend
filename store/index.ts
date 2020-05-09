import { Store } from 'vuex';
import { initialiseStores } from '~/libs/store-accessor';

const initializer = (store: Store<any>) => initialiseStores(store);
export const plugins = [initializer];
export * from '~/libs/store-accessor';
