<template>
  <div class="request-message">
    <table>
      <tr>
        <td class="text-right">User:</td>
        <td>
          <span :title="item.user">{{ split(item.user) }}</span>
        </td>
      </tr>
      <tr>
        <td class="text-right" style="width: 200px">Token:</td>
        <td>
          {{ item.tokenName }} <b>{{ item.tokenSymbol }}</b>
        </td>
      </tr>
      <tr>
        <td class="text-right">Log:</td>
        <td style="">
          <small>{{ item.log }}</small>
        </td>
      </tr>
      <tr v-if="item.token">
        <td class="text-right">Created:</td>
        <td>
          <div class="success">
            <a
              :href="`${tokenExplorer(item.token)}`"
              :title="item.token"
              target="_blank"
              >{{ split(item.token) }}</a
            >
          </div>
        </td>
      </tr>
      <tr v-if="!item.token">
        <td colspan="2" class="text-center">
          <button @click="$emit('success', item.id)" :disabled="item.load">
            ok
          </button>
          <button
            @click="$emit('remove', item.id)"
            :disabled="item.load"
            class="error"
          >
            remove
          </button>
        </td>
      </tr>
      <tr v-if="item.error">
        <td colspan="2" class="text-center">
          <div class="error">{{ item.error }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import config from "../config";

export default {
  props: ["item"],
  emits: ["success"],
  computed: {
    tokenExplorer() {
      return v => {
        return `${
          config.explorer
        }/accounts/accountDetails?id=${encodeURIComponent(v)}`;
      };
    },
    split() {
      return v => {
        if (v) {
          return v.substring(0, 7) + "..." + v.substr(-5);
        }
        return "";
      };
    }
  }
};
</script>
