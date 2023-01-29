<template>
  <v-container>
    <v-responsive class="d-flex align-center text-center fill-height mt-9">
      <h1 class="mb-4">Categories</h1>
      <div>
        {{remove}}
      </div>
      <v-row>
        <v-col sm="6" offset="3">
          <v-card :loading="isLoading">
            <template v-slot:text>
              <v-table>
                <thead>
                <tr>
                  <th class="text-center">
                    Name
                  </th>
                  <th class="text-center">
                    Type
                  </th>
                  <th class="text-center">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="item in categories"
                  :key="item.id"
                >
                  <td class="text-center">{{ item.name }}</td>
                  <td class="text-center">{{ item.type }}</td>
                  <td class="text-center">
                    <v-btn
                      color="primary"
                      icon="mdi-pencil"
                      size="x-small"
                      class="mr-1"
                    ></v-btn>
                    <v-btn
                      class="ml-1"
                      color="error"
                      icon="mdi-delete"
                      size="x-small"
                      @click="onRemoveClick({ name: item.name, id: item.id })"
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
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5 text-break">
          Remove {{remove.removeName}} category?
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
  </v-container>
</template>

<script>
import axios from "@/utils/axios";
import { ref, onMounted, reactive } from 'vue';

export default {
  name: "categories-item",
  setup() {
    const isLoading = ref(false);
    const removeDialog = ref(false);
    const categories = ref([]);
    const categoryToRemove = ref(null);

    const snackbar = reactive({
      isOpen: false,
      text: '',
      type: 'success'
    })

    const remove = reactive({
      removeDialog: false,
      removeName: '',
      itemToRemoveID: null,
    });

    const onRemove = async () => {
      isLoading.value = true;
      try {
        await axios.delete(`/category/${remove.itemToRemoveID}`);
        await getCategories();
        snackbar.type = 'success';
        snackbar.text = `${remove.removeName} was successfully removed`;
      } catch({ message }) {
        snackbar.type = 'error';
        snackbar.text = `${message}`;
      } finally {
        isLoading.value = false;
        snackbar.isOpen = true;
        remove.removeDialog = false;
      }
    };

    const onRemoveClick = (data) => {
      remove.removeName = data.name;
      remove.itemToRemoveID = data.id;
      remove.removeDialog = true;
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

    onMounted(() => {
      getCategories();
    });

    return { categories, isLoading, removeDialog, categoryToRemove, onRemoveClick, remove, onRemove, snackbar };
  }
}
</script>

<style scoped>

</style>
