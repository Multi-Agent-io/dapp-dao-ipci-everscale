<template>
  <div>
    <h3>Add auditor</h3>

    <div class="input">
      <label>Address:</label>
      <input v-model="newAuditorAddress" />
    </div>
    <div class="text-center">
      <button @click="submit" :disabled="load">Add</button>
    </div>

    <div v-if="transaction" class="success">{{ transaction }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import config from "../config";
import { addAuditor, isAuditor } from "../ever";

export default {
  data() {
    return {
      newAuditorAddress: "",
      transaction: null,
      error: null,
      load: false
    };
  },
  methods: {
    async check() {
      try {
        const res = await isAuditor(config.factory, this.newAuditorAddress);
        if (res) {
          this.error = "Already an auditor";
        }
      } catch (error) {
        this.error = error.message;
      }
    },
    async add() {
      try {
        const result = await addAuditor(config.factory, this.newAuditorAddress);
        this.transaction = result.id.hash;
      } catch (error) {
        this.error = error.message;
      }
    },
    async submit() {
      this.load = true;
      this.transaction = null;
      this.error = null;
      await this.check();
      if (this.error) {
        this.load = false;
        return;
      }
      await this.add();
      this.load = false;
    }
  }
};
</script>
