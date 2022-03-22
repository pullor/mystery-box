import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router'
import * as Vant from './vant';
import { userStore } from '@/store/user'

import './styles/index.less';

const somkey:string = import.meta.env.VITE_SOME_KEY
console.log('somkey: ', somkey);

const app = createApp(App);
app.use(createPinia()).use(router)

Object.values(Vant)
.reduce((app, com) => app.use(com), app);

userStore()
  .linkAuth()
  .then((openId) => {
    openId && app.mount('#app')
  })
