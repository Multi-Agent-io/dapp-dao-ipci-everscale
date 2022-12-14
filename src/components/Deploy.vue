<template>
  <div>
    <h3>Deploy token</h3>

    <table v-if="name">
      <tr>
        <td class="text-right" style="width: 50%">User:</td>
        <td>
          <input v-model="userAddress" />
        </td>
      </tr>
      <tr>
        <td class="text-right">Name:</td>
        <td>
          <input v-model="name" />
        </td>
      </tr>
      <tr>
        <td class="text-right">Symbol:</td>
        <td>
          <input v-model="symbol" />
        </td>
      </tr>
      <tr>
        <td class="text-right">Decimals:</td>
        <td>
          <input v-model="decimals" />
        </td>
      </tr>
      <tr>
        <td class="text-right">InitialSupply:</td>
        <td>
          <input v-model="initialSupply" />
        </td>
      </tr>
      <tr>
        <td colspan="2" class="text-center">
          <button @click="submit" :disabled="load">deploy</button>
        </td>
      </tr>
    </table>

    <div class="success" v-if="token">
      <small>{{ token }}</small>
    </div>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import config from "../config";
import { deployRoot, toAddress, toNano } from "../ever";

export default {
  props: ["account"],
  data() {
    return {
      userAddress: "",
      name: "TestAsset",
      symbol: "TST",
      decimals: "9",
      initialSupply: "100",
      token: null,
      error: null,
      load: false
    };
  },
  methods: {
    async deploy() {
      try {
        const result = await deployRoot(config.factory, {
          answerId: 0,
          name: this.name,
          symbol: this.symbol,
          decimals: this.decimals,
          owner: this.account,
          initialSupplyTo: toAddress(this.userAddress),
          initialSupply: toNano(this.initialSupply),
          deployWalletValue: toNano(0.2),
          mintDisabled: false,
          burnByRootDisabled: false,
          burnPaused: false,
          remainingGasTo: this.account,
          upgradeable: false
        });
        this.token = result;
      } catch (error) {
        this.error = error.message;
      }
    },
    async submit() {
      this.load = true;
      this.token = null;
      this.error = null;
      await this.deploy();
      this.load = false;
    }
  }
};
</script>
