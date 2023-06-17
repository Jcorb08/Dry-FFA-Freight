<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: Array,
  columns: Array
})

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <table v-if="data.length">
    <thead>
      <tr>
        <th v-for="key in columns">
          {{ capitalize(key) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in data">
        <td v-for="key in columns">
          {{entry[key]}}
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else>No matches found.</p>
</template>

<style>
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  /* background-color: #; */
  width: 100%;
}

th {
  background-color: #42b983;
  color: #fff;
}

td {
  /* background-color: #f9f9f9; */
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}
</style>