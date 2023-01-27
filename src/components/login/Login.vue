<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password"
      type="password"
      required
    ></v-text-field>

    <v-btn
      color="primary"
      class="me-4"
      @click="validate"
    >
      Login
    </v-btn>
    <p class="mt-5">
      <router-link to="/registration">I don't have account</router-link>
    </p>
    <v-alert v-if="userError" class="mt-5 text-capitalize" type="error">{{userError}}</v-alert>
  </v-form>
</template>

<script>
import axios from "@/utils/axios";
import router from "@/router";
import { ref } from 'vue';

export default {
  name: "login-item",
  setup() {
    const form = ref();
    const valid = ref(false);
    const userError = ref(null);

    const email = ref('');
    const emailRules = ref([
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ]);

    const password = ref('');
    const passwordRules = ref([
      v => !!v || 'Password is required',
      v => v.length > 4 || 'Password should be at least 4 characters long',
    ]);

    const validate = async () => {
      userError.value = null;
      const { valid } = await form.value.validate();
      if (valid) {
        try {
          const { token } = await axios.post('/signin', {
            email: email.value,
            password: password.value
          });
          localStorage.setItem('expenseToken', token);
          await router.push({ name: "Home" });
        } catch(e) {
          const { error } = e.response.data;
          userError.value = error;
        }
      }
    }

    return { emailRules, email, validate, form, valid, passwordRules, password, userError };
  },
}
</script>

<style scoped>

</style>
