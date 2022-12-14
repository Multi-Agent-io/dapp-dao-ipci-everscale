<template>
  <div>
    <h3>Token</h3>
    <div class="text-center">
      <input v-model="tokenAddress" />
    </div>
    <table v-if="name">
      <tr>
        <td class="text-right" style="width: 50%">Name:</td>
        <td>
          <b>{{ name }}</b>
        </td>
      </tr>
      <tr>
        <td class="text-right">Balance:</td>
        <td>
          <b>{{ balanceFormat }} {{ symbol }}</b>
        </td>
      </tr>
    </table>

    <Mint
      v-if="name && isAuditor"
      :account="account"
      :token="tokenAddress"
      :decimals="decimals"
      @mint="getBalance"
    />
    <Burn
      v-if="name"
      :account="account"
      :token="tokenAddress"
      :decimals="decimals"
      :balance="balance"
      @burn="getBalance"
    />
  </div>
</template>

<script>
import config from "../config";
import { fromNano, getBalanceToken, getTokenInfo } from "../ever";
import Burn from "./Burn.vue";
import Mint from "./Mint.vue";

export default {
  components: { Mint, Burn },
  props: ["account", "isAuditor"],
  data() {
    return {
      tokenAddress: config.asset,
      name: "",
      symbol: "",
      decimals: "",
      balance: ""
    };
  },
  computed: {
    balanceFormat() {
      return fromNano(this.balance, this.decimals);
    }
  },
  created() {
    this.getInfo();
    this.getBalance();
  },
  watch: {
    tokenAddress() {
      this.getInfo();
      this.getBalance();
    },
    account() {
      this.getBalance();
    }
  },
  methods: {
    async getInfo() {
      this.name = "";
      this.symbol = "";
      this.decimals = 0;
      this.balance = 0;
      try {
        const info = await getTokenInfo(this.tokenAddress);
        this.name = info.name;
        this.symbol = info.symbol;
        this.decimals = info.decimals;
        // eslint-disable-next-line no-empty
      } catch (_) {}
    },
    async getBalance() {
      this.balance = 0;
      try {
        this.balance = await getBalanceToken(this.tokenAddress, this.account);
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
  }
};
</script>
