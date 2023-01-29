<template>
  <v-container>
    <v-responsive class="d-flex align-center text-center fill-height mt-9">
      <h1 class="mb-4">Categories</h1>
      <div>
        {{category}}
      </div>
      <v-row>
        <v-col sm="6" offset="3">
          <v-card v-if="categories.length" :loading="isLoading">
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
          <v-card class="pb-2" v-else>
            <h2>There are no categories yet</h2>
            <v-btn
              class="mb-2 mt-2"
              color="primary"
              size="default"
              @click="onCategoryOpen"
            >
              Create
            </v-btn>
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
    <v-dialog
      v-model="category.categoryDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5 text-break">
          {{category.categoryID.length ? 'Edit' : 'Add'}} category
        </v-card-title>
        <v-card-item>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              required
              label="Category"
              placeholder="Enter Category Name"
              :rules="nameRule"
              v-model="category.categoryName"
              variant="underlined"
            ></v-text-field>
            <v-select
              required
              label="Select"
              :rules="typeRule"
              :items="['Expense', 'Income']"
              v-model="category.categoryType"
              variant="underlined"
            ></v-select>
          </v-form>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="onCategoryAdd"
          >
            Add
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="category.categoryDialog = false"
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
    const form = ref();
    const valid = ref(false);

    const snackbar = reactive({
      isOpen: false,
      text: '',
      type: 'success'
    });

    const category = reactive({
      categoryDialog: false,
      categoryName: '',
      categoryType: '',
      categoryID: ''
    });

    const remove = reactive({
      removeDialog: false,
      removeName: '',
      itemToRemoveID: null,
    });

    const onCategoryOpen = () => {
      category.categoryName = '';
      category.categoryID = '';
      // category.categoryType = '';
      category.categoryDialog = true;
    };

    const nameRule = ref([
      v => !!v || 'Name is required',
      v => v.length > 4 || 'Name should be at least 4 characters long',
    ]);

    const typeRule = ref([
      v => !!v || 'Type is required',
      v => v.length > 4 || 'Type should be at least 4 characters long',
    ]);

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

    const onCategoryAdd = async () => {
      isLoading.value = false;
      const { valid } = await form.value.validate();
      if (valid) {
        isLoading.value = true;
        try {
          await axios.post('/create-category', {
            name: category.categoryName,
            type: category.categoryType
          });
          await getCategories();
          snackbar.type = 'success';
          snackbar.text = 'Category was successfully added';
        } catch({ message }) {
          snackbar.type = 'error';
          snackbar.text = `${message}`;
        } finally {
          isLoading.value = false;
          snackbar.isOpen = true;
          category.categoryDialog = false;
        }
      }
    };

    onMounted(() => {
      getCategories();
    });

    return { categories, isLoading, form, valid, nameRule, typeRule, removeDialog, categoryToRemove, onRemoveClick, onCategoryOpen, remove, onRemove, category, snackbar, onCategoryAdd };
  }
}
</script>

<style scoped>

</style>
