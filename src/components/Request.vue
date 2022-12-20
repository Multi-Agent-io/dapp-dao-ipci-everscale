<template>
  <div>
    <h3>Request to create token</h3>
    <table v-if="name">
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
        <td class="text-right">Log ipfs hash:</td>
        <td>
          <input v-model="log" />
        </td>
      </tr>
      <tr>
        <td class="text-right">Auditor:</td>
        <td>
          <input v-model="auditor" />
        </td>
      </tr>
      <tr>
        <td colspan="2" class="text-center">
          <button @click="send" :disabled="!status">send</button>
        </td>
      </tr>
    </table>
    <div v-if="token" class="success">
      <a :href="`${tokenExplorer(token)}`" target="_blank">
        View explorer {{ token }}
      </a>
    </div>
  </div>
</template>

<script>
import { Buffer } from "buffer";
import config from "../config";
import { checkUserDeployRoot, events, getSubscriber } from "../ever";

export default {
  props: ["account", "status"],
  data() {
    return {
      name: "TestAsset",
      symbol: "TST",
      log: "",
      auditor: "",
      load: false,
      token: ""
    };
  },
  computed: {
    tokenExplorer() {
      return v => {
        return `${
          config.explorer
        }/accounts/accountDetails?id=${encodeURIComponent(v)}`;
      };
    }
  },
  methods: {
    async send() {
      this.token = "";
      this.load = true;
      const ipfs = await this.$ipfs;
      ipfs.pubsub.publish(
        config.topic,
        Buffer.from(
          JSON.stringify({
            auditor: this.auditor,
            log: this.log,
            tokenName: this.name,
            tokenSymbol: this.symbol,
            user: this.account
          })
        )
      );

      const subscriber = await getSubscriber();
      (
        await events(subscriber, config.factory, "RootDeployed", this.auditor)
      ).on(async tx => {
        const isUser = await checkUserDeployRoot(
          config.factory,
          this.account,
          tx.transaction.inMessage.body
        );
        if (isUser) {
          this.token = tx.data.root.toString();
          this.load = false;
          await subscriber.unsubscribe();
          return;
        }
      });
    }
  }
};
</script>
