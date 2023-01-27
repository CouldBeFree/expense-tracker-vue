<template>
  <v-main>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-row>
        <v-col sm="4" offset="4">
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "AuthenticationView"
}
</script>

<style scoped>

</style>
