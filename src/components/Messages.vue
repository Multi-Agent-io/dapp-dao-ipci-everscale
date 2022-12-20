<template>
  <div>
    <h3>Messages</h3>
    <Message
      v-for="(item, key) in messages"
      :key="key"
      :item="item"
      @success="success"
      @remove="remove"
    />
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { deployRoot, toAddress, toNano } from "../ever";
import Message from "./Message.vue";

export default {
  props: ["account"],
  components: {
    Message
  },
  data() {
    return {
      messages: [],
      initialSupply: "100"
    };
  },
  async created() {
    const ipfs = await this.$ipfs;

    ipfs.pubsub.subscribe(config.topic, message => {
      try {
        const { log, tokenName, tokenSymbol, auditor, user } = JSON.parse(
          Buffer.from(message.data).toString("utf8")
        );
        if (
          log &&
          tokenName &&
          tokenSymbol &&
          auditor &&
          user &&
          auditor === this.account
        ) {
          this.messages.push({
            id: uuidv4(),
            log,
            tokenName,
            tokenSymbol,
            auditor,
            user,
            load: false,
            error: null
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  },
  methods: {
    remove(id) {
      this.messages = this.messages.filter(item => item.id !== id);
    },
    async success(id) {
      const i = this.messages.findIndex(item => item.id === id);
      this.messages[i].load = true;
      this.messages[i].error = null;
      await this.deploy(id);
      this.messages[i].load = false;
    },
    async deploy(id) {
      const i = this.messages.findIndex(item => item.id === id);
      try {
        const result = await deployRoot(config.factory, {
          answerId: 0,
          name: this.messages[i].tokenName,
          symbol: this.messages[i].tokenSymbol,
          decimals: 9,
          owner: this.account,
          initialSupplyTo: toAddress(this.messages[i].user),
          initialSupply: toNano(this.initialSupply),
          deployWalletValue: toNano(0.2),
          mintDisabled: false,
          burnByRootDisabled: false,
          burnPaused: false,
          remainingGasTo: this.account,
          upgradeable: false
        });
        this.messages[i].token = result.toString();
      } catch (error) {
        this.messages[i].error = error.message;
      }
    }
  }
};
</script>
