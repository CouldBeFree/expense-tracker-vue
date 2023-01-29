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
      <v-row>
        <v-col sm="4">
          <v-card color="primary">
            <template v-slot:title>
              <p class="content">
                Expense By Category
              </p>
            </template>
            <template v-slot:text>
              <DoughnutChart
                :chart-data="data"
                :options="options"
              />
            </template>
          </v-card>
        </v-col>
        <v-col sm="4">
          <v-card color="primary">
            <template v-slot:title>
              <p class="content">
                Recent Transactions
              </p>
            </template>

            <template v-slot:text>
              <v-table>
                <thead>
                <tr>
                  <th class="text-center">
                    Category
                  </th>
                  <th class="text-center">
                    Date
                  </th>
                  <th class="text-center">
                    Amount
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="item in desserts"
                  :key="item.name"
                >
                  <td class="text-center">{{ item.category }}</td>
                  <td class="text-center">{{ item.date }}</td>
                  <td class="text-center">{{ item.amount }}</td>
                </tr>
                </tbody>
              </v-table>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import { ref, computed } from "vue";
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "home-item",
  setup() {
    const dataValues = ref([300, 50, 100, 40, 90, 230]);
    const data = computed(() => ({
      labels: [
        'Travel',
        'Health Care',
        'Garments',
        'Grocery',
        'Eating Outside',
        'Entertainments',
      ],
      datasets: [
        {
          data: dataValues.value,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgba(12, 18, 30)',
            'rgba(18, 235, 190)',
            'rgba(235, 208, 18)',
          ],
          hoverOffset: 4
        }
      ]
    }))

    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: "white"
          }
        },
        title: {
          display: false,
          text: "Doughnut"
        }
      }
    });

    const desserts = computed(() =>([
      {
        category: 'Travel',
        date: '01-12-23',
        amount: 300
      },
      {
        category: 'Travel',
        date: '01-12-23',
        amount: 300
      },
      {
        category: 'Food',
        date: '01-12-23',
        amount: 300
      },
      {
        category: 'Car',
        date: '01-12-23',
        amount: 300
      },
      {
        category: 'Travel',
        date: '01-12-23',
        amount: 300
      },
    ]));

    return { data, options, desserts }
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
