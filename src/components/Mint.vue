<template>
  <div>
    <h4>Mint</h4>

    <table>
      <tr>
        <td class="text-right" style="width: 50%">User:</td>
        <td>
          <input v-model="user" />
        </td>
      </tr>
      <tr>
        <td class="text-right">Amount:</td>
        <td>
          <input v-model="amount" />
        </td>
      </tr>
      <tr>
        <td colspan="2" class="text-center">
          <button @click="mint" :disabled="isDisabled">mint</button>
        </td>
      </tr>
    </table>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { mint, toNano } from "../ever";

export default {
  props: ["account", "token", "decimals"],
  emits: ["mint"],
  data() {
    return {
      user: "",
      amount: 0,
      load: false,
      error: null
    };
  },
  computed: {
    isDisabled() {
      return (
        this.load ||
        !this.user ||
        Number(this.amount) <= 0 ||
        isNaN(Number(this.amount))
      );
    }
  },
  methods: {
    async mint() {
      this.load = true;
      this.error = null;

      try {
        await mint(
          this.token,
          this.account,
          this.user,
          toNano(this.amount, this.decimals)
        );
        this.$emit("mint");
      } catch (error) {
        this.error = error.message;
      }

      this.load = false;
    }
  }
};
</script>
