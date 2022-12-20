<template>
  <div :title="id" :class="[status ? 'success' : 'error']">IPFS</div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      status: false
    };
  },
  async created() {
    const ipfs = await this.$ipfs;
    this.id = (await ipfs.id()).id;
    const peersFound = [
      "QmdfQmbmXt6sqjZyowxPUsmvBsgSGQjm4VXrV7WGy62dv8",
      "QmPTFt7GJ2MfDuVYwJJTULr6EnsQtGVp8ahYn9NSyoxmd9",
      "QmWZSKTEQQ985mnNzMqhGCrwQ1aTA6sxVsorsycQz9cQrw"
    ];
    setInterval(async () => {
      let status = false;
      const peers = await ipfs.pubsub.peers(
        "airalab.lighthouse.5.robonomics.eth"
      );
      for (const peer of peers) {
        if (peersFound.includes(peer.toString())) {
          status = true;
        }
      }
      this.status = status;
      await ipfs.swarm.connect(
        "/dns4/1.pubsub.aira.life/tcp/443/wss/ipfs/QmdfQmbmXt6sqjZyowxPUsmvBsgSGQjm4VXrV7WGy62dv8"
      );
      await ipfs.swarm.connect(
        "/dns4/2.pubsub.aira.life/tcp/443/wss/ipfs/QmPTFt7GJ2MfDuVYwJJTULr6EnsQtGVp8ahYn9NSyoxmd9"
      );
      // await ipfs.swarm.connect(
      //   "/dns4/3.pubsub.aira.life/tcp/443/wss/ipfs/QmWZSKTEQQ985mnNzMqhGCrwQ1aTA6sxVsorsycQz9cQrw"
      // );
    }, 3000);
  },
  watch: {
    status(v) {
      this.$emit("status", v);
    }
  }
};
</script>

<style scoped>
.success,
.error {
  font-size: 14px;
  color: black;
  padding: 7px;
}
</style>
