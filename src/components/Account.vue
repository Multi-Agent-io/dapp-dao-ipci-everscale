<template>
  <div>
    <span v-if="isOwner" class="label">Owner</span>
    <span v-if="isAuditor" class="label">Auditor</span>
    <span v-else-if="account" class="label">User</span>
    <b :title="account" class="account">{{ splitAccount }}</b>
    <button @click="changeAccount">Change account</button>
  </div>
</template>

<script>
import config from "../config";
import { changeAccount, getAccount, getOwner, isAuditor } from "../ever";

export default {
  data() {
    return {
      account: "",
      owner: "",
      isAuditor: false
    };
  },
  async created() {
    await this.setAccount();
  },
  computed: {
    isOwner() {
      if (this.account && this.owner && this.account === this.owner) {
        return true;
      }
      return false;
    },
    splitAccount() {
      return this.account.substring(0, 7) + "..." + this.account.substr(-5);
    }
  },
  watch: {
    account(v) {
      this.$emit("account", v);
    },
    isOwner(v) {
      this.$emit("owner", v);
    },
    isAuditor(v) {
      this.$emit("auditor", v);
    }
  },
  methods: {
    async setAccount() {
      this.account = await getAccount();
      this.owner = await getOwner(config.factory);
      this.isAuditor = await isAuditor(config.factory, this.account);
    },
    async changeAccount() {
      await changeAccount();
      await this.setAccount();
    }
  }
};
</script>

<style scoped>
.account {
  margin: 0 10px;
}
</style>
