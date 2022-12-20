<template>
  <app-header>
    <div class="item" style="display: flex">
      <Ipfs class="item" @status="r => (ipfs = r)" />
      <Account
        class="item"
        v-if="ready"
        @account="r => (account = r)"
        @auditor="r => (isAuditor = r)"
      />
    </div>
  </app-header>
  <div class="container">
    <template v-if="ready">
      <Messages class="block" :account="account" v-if="isAuditor" />
      <div v-else class="block">For auditors only</div>
    </template>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="loader">...</div>
  </div>
</template>

<script>
import Account from "../components/Account.vue";
import AppHeader from "../components/Header.vue";
import Ipfs from "../components/Ipfs.vue";
import Messages from "../components/Messages.vue";
import { initEver } from "../ever";

export default {
  components: {
    AppHeader,
    Account,
    Messages,
    Ipfs
  },
  data() {
    return {
      ready: false,
      account: "",
      isAuditor: false,
      error: null,
      messages: [],
      ipfs: false
    };
  },
  async created() {
    try {
      await initEver();
      this.ready = true;
    } catch (error) {
      this.error = error.message;
    }
  }
};
</script>
