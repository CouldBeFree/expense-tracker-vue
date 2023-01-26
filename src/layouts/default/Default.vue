<template>
  <v-app>
    <authentication-view v-if="isAuthRoute" />
    <dashboard-view v-else />
  </v-app>
</template>

<script>
import DashboardView from "@/layouts/default/DashboardView";
import AuthenticationView from "@/layouts/default/AuthenticationView";
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const route = useRoute();
    const isAuthRoute = computed(() => route.name === "Login" || route.name === "Registration");

    return { isAuthRoute };
  },
  components: { DashboardView, AuthenticationView }
}
</script>
