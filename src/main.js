import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { createVfm } from 'vue-final-modal'
import 'bootstrap/dist/css/bootstrap.min.css'

const vfm = createVfm()

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vfm);
app.mount('#app');


