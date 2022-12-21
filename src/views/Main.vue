<template>
  <app-header>
    <div class="item" style="display: flex">
      <Ipfs class="item" @status="r => (ipfs = r)" />
      <Account
        class="item"
        v-if="ready"
        @account="r => (account = r)"
        @auditor="r => (isAuditor = r)"
        @owner="r => (isOwner = r)"
      />
    </div>
  </app-header>
  <div class="container">
    <template v-if="ready">
      <AddAuditor class="block" v-if="isOwner" />
      <Request
        class="block"
        :account="account"
        :status="ipfs"
        @newToken="v => $refs.Token.getTokens()"
      />
      <Token
        ref="Token"
        class="block"
        :account="account"
        :isAuditor="isAuditor"
      />
    </template>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="loader">...</div>
  </div>
</template>

<script>
import Account from "../components/Account.vue";
import AddAuditor from "../components/AddAuditor.vue";
import AppHeader from "../components/Header.vue";
import Ipfs from "../components/Ipfs.vue";
import Request from "../components/Request.vue";
import Token from "../components/Token.vue";
import { initEver } from "../ever";

export default {
  components: {
    AppHeader,
    Account,
    AddAuditor,
    Token,
    Request,
    Ipfs
  },
  data() {
    return {
      ready: false,
      account: "",
      isOwner: false,
      isAuditor: false,
      error: null,
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
