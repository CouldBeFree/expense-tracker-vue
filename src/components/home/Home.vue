<template>
  <v-container>
    <v-responsive class="d-flex align-center text-center fill-height mt-9">
      <v-row>
        <v-col sm="4" offset="4">
          <datepicker-item month-picker v-model="date"></datepicker-item>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="4">
          <v-card color="primary">
            <template v-slot:title>
              Total Income
            </template>

            <template v-slot:text>
              <div class="content">${{calculateTotal.income}}</div>
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
                ${{calculateTotal.expense}}
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
              <p class="content">${{calculateTotal.income - calculateTotal.expense}}</p>
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
                  v-for="item in recentTransactions"
                  :key="item.id"
                >
                  <td class="text-center">{{ item?.cat[0].name }}</td>
                  <td class="text-center">{{ item.date }}</td>
                  <td class="text-center" :class="{ 'expense': item.cat[0].type === CATEGORY_TYPES.EXPENSE, 'income': item.cat[0].type === CATEGORY_TYPES.INCOME }">
                    {{item.cat[0].type === CATEGORY_TYPES.EXPENSE ? '-' : '+'}}{{ item.amount }}
                  </td>
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
import { ref, computed, onMounted, toRaw } from "vue";
import { CATEGORY_TYPES } from '@/constants/common';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import axios from "@/utils/axios";
Chart.register(...registerables);

export default {
  name: "home-item",
  setup() {
    const date = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
    const chartData = ref([]);
    const total = ref([]);
    const recentTransactions = ref([]);
    const calculateTotal = computed(function () {
      const output = {
        expense: 0,
        income: 0
      }

      total.value.forEach(el => {
        if (el?.category[0].type === "Expense") {
          output.expense += +el?.total;
        }
        if (el?.category[0].type === "Income") {
          output.income += +el?.total;
        }
      });

      return output;
    });
    const data = computed(() => ({
      labels: chartData.value.length ? chartData.value.map(el => el?.category[0].name) : [],
      datasets: [
        {
          data: chartData.value.length ? chartData.value.map(el => el?.total) : [],
          backgroundColor: chartData.value.map(el => el?.category[0].color),
          hoverOffset: 4
        }
      ]
    }));
    const payloadDate = computed(() => {
      const transformedMoth = Number(date.value.month + 1);
      return `${date.value.year}-${transformedMoth >= 10 ? transformedMoth : `0${transformedMoth}`}-01`;
    });

    const month = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });

    // First day of the month
    // const dt = new Date(2023, 1);
    // const dateStr = '2023-01-01';
    //
    // const date = new Date(dateStr);
    //
    // const iso = date.toISOString();
    // console.log(iso);

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

    const getChartData = async () => {
      try {
        const data = await axios.get('/transaction-by-category');
        total.value = data;
        chartData.value = data.filter(el => el.category[0].type === CATEGORY_TYPES.EXPENSE);
      } catch (e) {
        console.error(e);
      }
    }

    const getTransactions = async () => {
      try {
        recentTransactions.value = await axios.get('/transactions', {
          params: {
            limit: 5
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    onMounted(() => {
      getChartData();
      getTransactions();
    });

    const onDateSelect = (val) => {
      console.log('v', val);
      // data.value = val;
    }

    return { data, options, date, calculateTotal, onDateSelect, payloadDate, chartData, recentTransactions, CATEGORY_TYPES }
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

.expense {
  color: red;
}

.income {
  color: green;
}
</style>
