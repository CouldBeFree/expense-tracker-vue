<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="name"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

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
      Register
    </v-btn>
    <p class="mt-5">
      <router-link to="/login">I already have account</router-link>
    </p>
    <v-alert v-if="userError" class="mt-5" type="error">{{userError}}</v-alert>
    <v-alert v-if="userSuccess" class="mt-5" type="success">
      I have been successfully registered. No you can <router-link to="/login">Login</router-link>
    </v-alert>
  </v-form>
</template>

<script>
import {ref} from "vue";
import axios from "@/utils/axios";

export default {
  name: "registration-item",
  setup() {
    const form = ref();
    const valid = ref(false);
    const userError = ref(null);
    const userSuccess = ref(false);

    const name = ref('');
    const nameRules = ref([
      v => !!v || 'Name is required',
      v => (v && v.length > 4) || 'Name must be less than 4 characters',
    ])

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
      userSuccess.value = false;
      userError.value = null;
      const { valid } = await form.value.validate();
      if (valid) {
        try {
          await axios.post('/register', {
            email: email.value,
            password: password.value,
            username: name.value
          });
          userSuccess.value = true;
        } catch(e) {
          userError.value = Object.values(e.response.data)[0];
        }
      }
    }

    return { emailRules, email, validate, form, valid, passwordRules, password, userError, nameRules, name, userSuccess };
  },
}
</script>

<style scoped>

</style>
