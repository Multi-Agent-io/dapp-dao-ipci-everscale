<template>
  <div>
    <h3>Token</h3>
    <div class="text-center">
      <select v-model="selectTokenAddress">
        <option v-for="(item, key) in tokens" :key="key" :value="item">
          {{ item }}
        </option>
      </select>
      <input v-if="selectTokenAddress === 'other'" v-model="tokenAddress" />
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
import {
  checkUserDeployRoot,
  fromNano,
  getBalanceToken,
  getPastEvents,
  getTokenInfo
} from "../ever";
import Burn from "./Burn.vue";
import Mint from "./Mint.vue";

export default {
  components: { Mint, Burn },
  props: ["account", "isAuditor"],
  data() {
    return {
      selectTokenAddress: "other",
      tokenAddress: config.asset,
      name: "",
      symbol: "",
      decimals: "",
      balance: "",
      tokens: []
    };
  },
  computed: {
    balanceFormat() {
      return fromNano(this.balance, this.decimals);
    }
  },
  created() {
    this.getTokens();
    this.getInfo();
    this.getBalance();
  },
  watch: {
    tokenAddress() {
      this.getInfo();
      this.getBalance();
    },
    selectTokenAddress(v) {
      if (v !== "other") {
        this.tokenAddress = v;
      } else {
        this.tokenAddress = "";
      }
    },
    account() {
      this.getBalance();
    }
  },
  methods: {
    async getTokens() {
      this.tokens = ["other"];
      const events = await getPastEvents(config.factory);
      for (const event of events.events) {
        const isUser = await checkUserDeployRoot(
          config.factory,
          this.account,
          event.transaction.inMessage.body
        );
        if (isUser) {
          this.tokens.push(event.data.root.toString());
        }
      }
    },
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
