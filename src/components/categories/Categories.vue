<template>
  <h1>Categories</h1>
  <div>
    {{categories}}
  </div>
  <ul>
    <li v-for="category in categories" :key="category.id">
      <p>{{category.name}}</p>
      <p>{{category.type}}</p>
    </li>
  </ul>
</template>

<script>
import axios from "@/utils/axios";
import {ref, onMounted} from 'vue';

export default {
  name: "categories-item",
  setup() {
    const isLoading = ref(false);
    const categories = ref([]);

    const getCategories = async () => {
      isLoading.value = true;
      try {
        const data = await axios.get('/categories')
        console.log(data);
        categories.value = data;
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    }

    onMounted(() => {
      getCategories();
    });

    return { categories }
  }
}
</script>

<style scoped>

</style>
