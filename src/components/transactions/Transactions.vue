<template>
  <v-container>
    <v-responsive class="d-flex align-center text-center fill-height mt-9">
      <h1 class="mb-4">Transactions</h1>
      <v-btn
        color="success"
        class="mb-2"
        @click="onTransactionOpen"
      >
        Add new transaction
      </v-btn>
      <v-row v-if="transactions.length">
        <v-col sm="6" offset="3">
          <v-card>
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
                  <th class="text-center">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="item in transactions"
                  :key="item.id"
                >
                  <td class="text-center">{{ item.cat[0].name }}</td>
                  <td class="text-center">{{ item.date }}</td>
                  <td
                    class="text-center"
                    :class="{ 'expense': item.cat[0].type === 'Expense', 'income': item.cat[0].type === 'Income' }"
                  >
                    {{item.cat[0].type === 'Expense' ? '-' : '+'}}{{ item.amount }}
                  </td>
                  <td class="text-center">
                    <v-btn
                      color="primary"
                      icon="mdi-pencil"
                      size="x-small"
                      class="mr-1"
                      @click="onEditOpen({ name: item.name, type: item.type, id: item.id })"
                    ></v-btn>
                    <v-btn
                      class="ml-1"
                      color="error"
                      icon="mdi-delete"
                      size="x-small"
                      @click="onRemoveClick(item.id)"
                    ></v-btn>
                  </td>
                </tr>
                </tbody>
              </v-table>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
    <v-dialog
      v-model="remove.removeDialog"
      max-width="300"
    >
      <v-card>
        <v-card-title class="text-h5 text-break">
          Remove Transaction?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="onRemove"
          >
            Remove
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="remove.removeDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="3000"
      v-model="snackbar.isOpen"
      :color="snackbar.type"
    >
      <p class="text-center">
        {{ snackbar.text }}
      </p>
    </v-snackbar>
    <v-dialog
      v-model="transaction.transactionDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5 text-break">
          Add Transaction
        </v-card-title>
        <v-card-item>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-select
              required
              label="Category"
              placeholder="Select Category"
              :rules="categoryRule"
              :items="categoryValues"
              v-model="transaction.transactionCategory"
              variant="underlined"
            ></v-select>
            <v-text-field
              required
              label="Amount"
              type="number"
              placeholder="Enter Amount"
              :rules="amountRule"
              v-model="transaction.transactionAmount"
              variant="underlined"
            ></v-text-field>
            <datepicker-item required v-model="date" :format="format"></datepicker-item>
          </v-form>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="handleTransaction"
          >
<!--            {{category.categoryID.length ? 'Edit' : 'Add'}}-->
            Add
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="transaction.transactionDialog = false;"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, reactive, computed, watch, toRaw } from 'vue';
import axios from "@/utils/axios";
export default {
  name: "transactions-item",
  setup() {
    const date = ref(new Date());
    const categories = ref([]);
    const form = ref();
    const valid = ref(false);
    const transactions = ref([]);
    const isLoading = ref(false);
    const transaction = reactive({
      transactionDate: '',
      transactionAmount: '',
      transactionDialog: false,
      transactionName: '',
      transactionCategory: '',
      transactionCategoryID: '',
      transactionID: ''
    });

    const format = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `Selected date is ${day}/${month}/${year}`;
    }

    const categoryValues = computed(function () {
      return categories.value.map(cat => cat.name);
    });

    const onTransactionOpen = () => {
      transaction.transactionID = '';
      transaction.transactionName = '';
      transaction.transactionCategoryID = '';
      transaction.transactionCategory = '';
      transaction.transactionAmount = '';
      transaction.transactionDialog = true;
    };

    const getCategories = async () => {
      isLoading.value = true;
      try {
        categories.value = await axios.get('/categories');
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };

    const remove = reactive({
      removeDialog: false,
      itemToRemoveID: null,
    });

    const onEditOpen = (data) => {
      const { name, type, id } = data;
      transaction.categoryName = name;
      transaction.categoryID = id;
      transaction.categoryType = type;
      transaction.categoryDialog = true;
    };

    const getTransactions = async () => {
      isLoading.value = true;
      try {
        transactions.value = await axios.get('/transactions');
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };

    const handleTransaction = async () => {
      isLoading.value = false;
      const { valid } = await form.value.validate();
      if (valid) {
        isLoading.value = true;
        try {
          if (transaction.transactionID.length) {
            // PUT
          } else {
            await axios.post('/create-transaction', {
              amount: transaction.transactionAmount,
              category: transaction.transactionCategoryID,
              date: transaction.transactionDate
            });
          }
          snackbar.type = 'success';
          snackbar.text = `Transaction was successfully ${transaction.categoryID ? 'updated' : 'added'}`;
          await getTransactions();
        } catch (e) {
          console.error(e);
        } finally {
          snackbar.isOpen = true;
          isLoading.value = false;
          transaction.transactionDialog = false;
        }
      }
    }

    watch(
      () => transaction.transactionCategory,
      (val) => {
        const category = categories.value.find((el) => el.name === val);
        const rawCategory = toRaw(category);
        if (rawCategory) {
          transaction.transactionCategoryID = rawCategory.id;
        }
      });

    watch(date, (newVal) => {
      const d = new Date(newVal);
      transaction.transactionDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }, { immediate: true });

    const categoryRule = ref([
      v => !!v || 'Category is required',
    ]);

    const amountRule = ref([
      v => !!v || 'Amount is required',
    ]);

    const snackbar = reactive({
      isOpen: false,
      text: '',
      type: 'success'
    });

    const onRemove = async () => {
      isLoading.value = true;
      try {
        await axios.delete(`/transaction/${remove.itemToRemoveID}`);
        await getTransactions();
        snackbar.type = 'success';
        snackbar.text = 'Transaction was successfully removed';
      } catch({ message }) {
        snackbar.type = 'error';
        snackbar.text = `${message}`;
      } finally {
        isLoading.value = false;
        snackbar.isOpen = true;
        remove.removeDialog = false;
      }
    }

    const onRemoveClick = (id) => {
      remove.removeDialog = true;
      remove.itemToRemoveID = id;
    }

    onMounted(() => {
      getCategories();
      getTransactions();
    });

    return { onTransactionOpen, remove, transactions, snackbar, onRemove, transaction, categories, categoryValues, categoryRule, handleTransaction, valid, amountRule, form, date, format, onRemoveClick };
  }
}
</script>

<style scoped>
.expense {
  color: red;
}

.income {
  color: green;
}
</style>
