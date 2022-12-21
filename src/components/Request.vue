<template>
  <div>
    <h3>Request to create token</h3>
    <div class="input">
      <label>Name:</label>
      <input v-model="name" />
    </div>
    <div class="input">
      <label>Symbol:</label>
      <input v-model="symbol" />
    </div>
    <div class="input">
      <label>Log ipfs hash:</label>
      <input v-model="log" />
    </div>
    <div class="input">
      <label>Auditor:</label>
      <input v-model="auditor" />
    </div>
    <div class="text-center">
      <button @click="send" :disabled="!status">send</button>
    </div>

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
  emits: ["newToken"],
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
          this.$emit("newToken", this.token);
          await subscriber.unsubscribe();
          return;
        }
      });
    }
  }
};
</script>
