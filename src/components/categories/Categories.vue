<template>
  <v-container>
    <v-responsive class="d-flex align-center text-center fill-height mt-9">
      <h1 class="mb-4">Categories</h1>
      <v-btn
        color="success"
        class="mb-2"
        @click="onCategoryOpen"
      >
        Add new category
      </v-btn>
      <v-row v-if="categories.length">
        <v-col sm="6" offset="3">
          <v-card :loading="isLoading" class="mb-5">
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
                    Color
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
                    <div class="background-block" :style="{background: item.color}"></div>
                  </td>
                  <td class="text-center">
                    <v-btn
                      color="primary"
                      icon="mdi-pencil"
                      size="x-small"
                      class="mr-1"
                      @click="onEditOpen({ name: item.name, type: item.type, id: item.id, color: item.color })"
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
    <v-dialog
      v-model="category.categoryDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5 text-break">
          <p>
            {{category.categoryID.length ? 'Edit' : 'Add'}} category {{category.categoryColor}}
          </p>
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
              label="Category Type"
              placeholder="Select Category Type"
              :rules="typeRule"
              :items="['Expense', 'Income']"
              v-model="category.categoryType"
              variant="underlined"
            ></v-select>
            <div class="d-flex justify-center mb-2">
              <v-color-picker v-model="category.categoryColor" hide-inputs></v-color-picker>
            </div>
          </v-form>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="handleCategory"
          >
            {{category.categoryID.length ? 'Edit' : 'Add'}}
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
      categoryID: '',
      categoryColor: '#171717'
    });

    const remove = reactive({
      removeDialog: false,
      removeName: '',
      itemToRemoveID: null,
    });

    const onEditOpen = (data) => {
      const { name, type, id, color } = data;
      console.log(data);
      category.categoryName = name;
      category.categoryID = id;
      category.categoryType = type;
      category.categoryColor = color;
      category.categoryDialog = true;
    }

    const onCategoryOpen = () => {
      category.categoryName = '';
      category.categoryID = '';
      category.categoryType = '';
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

    const handleCategory = async () => {
      isLoading.value = false;
      const { valid } = await form.value.validate();
      if (valid) {
        isLoading.value = true;
        try {
          if (category.categoryID) {
            await axios.put(`/category/${category.categoryID}`, {
              name: category.categoryName,
              type: category.categoryType,
              color: category.categoryColor
            });
          } else {
            await axios.post('/create-category', {
              name: category.categoryName,
              type: category.categoryType,
              color: category.categoryColor
            });
          }
          await getCategories();
          snackbar.type = 'success';
          snackbar.text = `Category was successfully ${category.categoryID ? 'updated' : 'added'}`;
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

    return { categories, isLoading, onEditOpen, form, valid, nameRule, typeRule, removeDialog, categoryToRemove, onRemoveClick, onCategoryOpen, remove, onRemove, category, snackbar, handleCategory };
  }
}
</script>

<style scoped>
.background-block {
  margin: 0 auto;
  width: 15px;
  height: 15px;
}
</style>
