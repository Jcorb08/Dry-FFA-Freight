<script setup>
import { ref, onUpdated, watchEffect } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import Table from './components/Table.vue'
import '@vuepic/vue-datepicker/dist/main.css'


// grab date selected and format for api calls
const selectedDate = ref(new Date())
const format = (date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `Selected date is ${day}/${month}/${year}`
}
const getDateFormat = (date) => {
  let day = date.getDate()
  if(day <= 9)
    day = '0'+day
  let month = date.getMonth() + 1
  if(month <= 9)
    month = '0'+month
  const year = date.getFullYear()

  return `${year}${month}${day}`
}
onUpdated(() => {
  selectedDate.value
  chartOptions.value
})

//api calls
const API_URL = "https://www.ssyreports.com/api/"
const calls = ["ExampleEodCommentary","ExampleEodPrices","ExampleEodCapeIndex"]
const token = "2KHgQs6KkuyFup9Y"
const responses = ref(null)
const vesselRoutes = {
  'CP1':'Hampton Roads / Rotterdam',
  'CP2':'Tubarao / Rotterdam',
  'CP3':'Tubarao / Qingdao',
  'CP4':'Richards Bay / Rotterdam',
  'CP5':'West Australia / Qingdao',
  'CP7':'Bolivar / Rotterdam'
}
const tableHeadings = ["periodCode","price","doD"]
const chartOptions = ref(null)

watchEffect(async () => {
  // this effect will run immediately and then
  // re-run whenever currentBranch.value changes
  let res = []
  for (let index = 0; index < calls.length; index++) {
    if (index == 1) {
      let routes = {}
      for (const key in vesselRoutes) {
        const url = `${API_URL}${calls[index]}/${token}/${key}/${getDateFormat(selectedDate.value)}`
        routes[key] = await (await fetch(url)).json()
      }
      res.push(routes)
    } else {
      const url = `${API_URL}${calls[index]}/${token}/${getDateFormat(selectedDate.value)}`
      res.push(await (await fetch(url)).json())
    }
  }

  let seriesData = []
  for (let index = 0; index < res[2].length; index++) {
    seriesData.push([
      new Date(res[2][index].priceDate).getTime(),
      res[2][index].price
    ]);
  }

  chartOptions.value = {
    rangeSelector: {
        selected: 1
      },
    series: [
      {
        name: 'priceDate',
        data: seriesData  ,
        type: 'spline',
        tooltip: {
          valueDecimals: 2
        }
      },
    ],
  }
  responses.value = res
  console.log(responses.value);
})
</script>

<template>
  <header>
    <div class="greetings">
      <h1 class="green">Dry FFA Freight Summary</h1>
      <div>
        <p>Pick reporting date:</p>
        <VueDatePicker v-model="selectedDate" :format="format" :enable-time-picker="false" dark></VueDatePicker>    
      </div>
    </div>
  </header>

  <main v-if="responses">
    <div class="item">
      <div class="details">
        <h2>Market fundamentals and vessel (Capesize) commentary.</h2>
        <div v-if="responses[0].length" class="white-background">
          <p v-html="responses[0][0]['comment']"></p>
          <p v-html="responses[0][1]['comment']"></p>
        </div>
        <p v-else>No commentry at this time.</p>
      </div>
    </div>
    <div class="item">
      <div class="details">
        <div v-if="responses[1]">
          <h2>Vessel route prices</h2>
          <div>
            <div v-for="(value, key) in responses[1]">
              <h3>{{ vesselRoutes[key] }}</h3>
              <Table
                :data="value"
                :columns="tableHeadings">
              </Table>
            </div>
          </div>
          
        </div>
        <p v-else>No commentry at this time.</p>
      </div>
    </div>
    <div class="item">
      <div class="details">
        <div v-if="responses[2].length">
          <h2>Cape Index prices over the past year</h2>
          <highcharts :constructor-type="'stockChart'" :options="chartOptions" />
        </div>
        <p v-else>No commentry at this time.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  position: fixed;
  width: 100vw;
  background: var(--color-background);
  z-index: 10;
  top: 0;
  left: 0;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

main {
  margin-top: 10rem;
  background-color: white;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

p {
  font-size: 1.2rem;
}

.greetings {
  width: 40%;
  margin: auto;
}

.greetings h1,
.greetings h2 {
  text-align: center;
}

.greetings p {
  color: white;
}

.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

.white-background{
  background-color: white;
  padding: 0.5rem;
}

h2 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

h3 {
  margin: 0.4rem 0;
}
</style>
