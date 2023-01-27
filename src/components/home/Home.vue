<template>
  <v-container>
    <v-responsive class="d-flex align-center text-center fill-height mt-9">
      <v-row>
        <v-col sm="4">
          <v-card color="primary">
            <template v-slot:title>
              Total Income
            </template>

            <template v-slot:text>
              <div class="content">$10,000</div>
            </template>
          </v-card>
        </v-col>
        <v-col sm="4">
          <v-card color="primary">
            <template v-slot:title>
              Total Expense
            </template>

            <template v-slot:text>
              <p class="content">
                $2,350
              </p>
            </template>
          </v-card>
        </v-col>
        <v-col sm="4">
          <v-card color="primary">
            <template v-slot:title>
              <p class="content">
                Balance
              </p>
            </template>

            <template v-slot:text>
              <p class="content">$2,350</p>
            </template>
          </v-card>
        </v-col>
      </v-row>
      <DoughnutChart
        :chart-data="data"
        :options="options"
        css-classes="chart-container"
      />
    </v-responsive>
  </v-container>
</template>

<script>
import { ref, computed } from "vue"
import { DoughnutChart } from "vue-chart-3"
import { Chart, DoughnutController, ArcElement } from 'chart.js'
Chart.register(DoughnutController, ArcElement)
const dataValues = ref([10, 20, 40])

export default {
  name: "home-item",
  setup() {
    const data = computed(() => ({
      labels: ["Foo", "Bar", "Baz"],
      datasets: [
        {
          data: dataValues.value,
          backgroundColor: ["#859900", "#d33682", "#cb4b16"]
        }
      ]
    }))

    const options = ref({
      plugins: {
        title: {
          text: "Doughnut"
        }
      }
    })

    return { options, data }
  },
  components: {
    DoughnutChart
  }
}
</script>

<style scoped>
.content {
  font-size: 18px;
}
</style>
