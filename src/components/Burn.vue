<template>
  <div>
    <h4>Burn</h4>

    <div class="input">
      <label>Amount:</label>
      <input v-model="amount" />
    </div>
    <div class="text-center">
      <button @click="burn" :disabled="isDisabled">burn</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { burn, toNano } from "../ever";

export default {
  props: ["account", "token", "decimals", "balance"],
  emits: ["burn"],
  data() {
    return {
      amount: 0,
      load: false,
      error: null
    };
  },
  computed: {
    isDisabled() {
      return (
        this.load ||
        Number(this.balance) <= 0 ||
        isNaN(Number(this.balance)) ||
        Number(this.amount) <= 0 ||
        isNaN(Number(this.amount)) ||
        Number(this.balance) < toNano(this.amount, this.decimals)
      );
    }
  },
  methods: {
    async burn() {
      this.load = true;
      this.error = null;

      try {
        await burn(
          this.token,
          this.account,
          toNano(this.amount, this.decimals)
        );
        this.$emit("burn");
      } catch (error) {
        this.error = error.message;
      }

      this.load = false;
    }
  }
};
</script>
