import { createApp } from "vue";
import App from "./App.vue";
import Ipfs from "./plugins/ipfs";
import router from "./router";

createApp(App)
  .use(router)
  .use(Ipfs, {
    config: {
      Addresses: {
        Swarm: [
          "/dns4/1.webrtcstar.aira.life/tcp/443/wss/p2p-webrtc-star/",
          "/dns4/2.webrtcstar.aira.life/tcp/443/wss/p2p-webrtc-star/",
          "/dns4/3.webrtcstar.aira.life/tcp/443/wss/p2p-webrtc-star/"
        ]
      },
      Bootstrap: [
        "/dns4/1.pubsub.aira.life/tcp/443/wss/ipfs/QmdfQmbmXt6sqjZyowxPUsmvBsgSGQjm4VXrV7WGy62dv8",
        "/dns4/2.pubsub.aira.life/tcp/443/wss/ipfs/QmPTFt7GJ2MfDuVYwJJTULr6EnsQtGVp8ahYn9NSyoxmd9",
        "/dns4/3.pubsub.aira.life/tcp/443/wss/ipfs/QmWZSKTEQQ985mnNzMqhGCrwQ1aTA6sxVsorsycQz9cQrw"
      ]
    }
  })
  .mount("#app");
