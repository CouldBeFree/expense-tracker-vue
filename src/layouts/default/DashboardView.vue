<template>
  <v-layout>
    <v-navigation-drawer
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/19.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item :link="true" exact :to="'/'" prepend-icon="mdi-home-outline" title="Home" value="Home"></v-list-item>
        <v-list-item :link="true" exact :to="'/categories'" prepend-icon="mdi-chart-arc" title="Categories" value="Categories"></v-list-item>
        <v-list-item :link="true" exact :to="'/transactions'" prepend-icon="mdi-finance" title="Transactions" value="Transactions"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item @click="onLogout" prepend-icon="mdi-exit-to-app" title="Logout" value="Logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="fill-height">
      <router-view/>
    </v-main>
  </v-layout>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  name: "DashboardView",
  setup() {
    const router = useRouter();

    const onLogout = () => {
      localStorage.removeItem('expenseToken');
      router.push({ path: '/login' });
    }

    return { onLogout }
  }
}
</script>

<style scoped>

</style>
