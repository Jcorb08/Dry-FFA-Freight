import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'


import Highcharts from "highcharts";
import StockModule from "highcharts/modules/stock";
import HighchartsVue from "highcharts-vue";

// In order to use Highcharts Stock we need to
// wrap Highcharts with the correct module:
StockModule(Highcharts);

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App);

app.component('VueDatePicker', VueDatePicker);
app.use(HighchartsVue)

app.mount('#app'); 
