import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import AssetFactoryAbi from "./abi/AssetFactory.abi.json";
import TokenRoot from "./abi/TokenRoot.abi.json";
import TokenWallet from "./abi/TokenWallet.abi.json";

let provider;
export async function initEver() {
  if (provider) {
    return provider;
  }
  provider = new ProviderRpcClient();
  if (!(await provider.hasProvider())) {
    throw new Error("Extension is not installed");
  }
  return provider;
}

export async function getAccount() {
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  const { accountInteraction } = await provider.requestPermissions({
    permissions: ["basic", "accountInteraction"]
  });
  if (accountInteraction == null) {
    throw new Error("Insufficient permissions");
  }
  return accountInteraction.address._address;
}

export async function changeAccount() {
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  await provider.changeAccount();
}

export function getFactory(address) {
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  const assetFactoryAddress = new Address(address);
  return new provider.Contract(AssetFactoryAbi, assetFactoryAddress);
}

export async function getOwner(factory) {
  const assetFactory = getFactory(factory);
  const output = await assetFactory.methods._owner().call();
  return output._owner._address;
}

export async function isAuditor(factory, address) {
  const assetFactory = getFactory(factory);
  const output = await assetFactory.methods
    .isAuditor({ answerId: 0, auditor: address })
    .call();
  return output.value0;
}

export async function addAuditor(factory, address) {
  const assetFactory = getFactory(factory);
  return await assetFactory.methods
    .addAuditor({
      auditor: new Address(address)
    })
    .send({
      from: await getAccount(),
      amount: toNano(1)
      // bounce: true
    });
}

export async function checkUserDeployRoot(factory, user, body) {
  const assetFactory = getFactory(factory);
  const res = await assetFactory.decodeInputMessage({
    body: body,
    methods: ["deployRoot"],
    internal: true
  });
  if (res) {
    return res.input.initialSupplyTo.equals(toAddress(user));
  }
  return false;
}

export async function getSubscriber() {
  return await new provider.Subscriber();
}

export async function events(subscriber, factory, eventName, sender) {
  const assetFactory = getFactory(factory);
  return assetFactory.events(subscriber).filter(tx => {
    return (
      tx.event === eventName &&
      tx.transaction.inMessage.src.equals(toAddress(sender))
    );
  });
}

export async function deployRoot(factory, params) {
  const assetFactory = getFactory(factory);

  const tx = await assetFactory.methods
    .deployRoot(params)
    .send({ from: await getAccount(), amount: toNano(4) });

  let sub = new provider.Subscriber();
  let deploy_tx = await sub
    .trace(tx)
    .filter(tx_in_tree => {
      return tx_in_tree.account._address == assetFactory.address.toString();
    })
    .first();

  let decoded_events = await assetFactory.decodeTransactionEvents({
    transaction: deploy_tx
  });

  return decoded_events[0].data.root;
}

export function getTokenRoot(address) {
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  return new provider.Contract(TokenRoot, new Address(address));
}

export async function getWalletAddress(rootAddress, account) {
  const root = getTokenRoot(rootAddress);
  return (
    await root.methods.walletOf({ answerId: 0, walletOwner: account }).call()
  ).value0.toString();
}

export async function getTokenInfo(rootAddress) {
  const root = getTokenRoot(rootAddress);
  const name = (await root.methods.name({ answerId: 0 }).call()).value0;
  const symbol = (await root.methods.symbol({ answerId: 0 }).call()).value0;
  const decimals = (await root.methods.decimals({ answerId: 0 }).call()).value0;
  return {
    name,
    symbol,
    decimals
  };
}

export function getTokenWallet(address) {
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  return new provider.Contract(TokenWallet, new Address(address));
}

export async function getBalanceToken(rootAddress, account) {
  const tokenWalletAddress = await getWalletAddress(rootAddress, account);
  const tokenWallet = getTokenWallet(tokenWalletAddress);
  const output = await tokenWallet.methods.balance({ answerId: 0 }).call();
  return output.value0;
}

export async function burn(rootAddress, account, amount) {
  const tokenWalletAddress = await getWalletAddress(rootAddress, account);
  const tokenWallet = getTokenWallet(tokenWalletAddress);
  const tx = await tokenWallet.methods
    .burn({
      amount: amount,
      remainingGasTo: account,
      callbackTo: toAddress(
        "0:0000000000000000000000000000000000000000000000000000000000000000"
      ),
      payload: ""
    })
    .send({ from: account, amount: toNano(1) });
  return tx;
}

export async function mint(rootAddress, auditor, account, amount) {
  const tokenRoot = await getTokenRoot(rootAddress);
  const tx = await tokenRoot.methods
    .mint({
      amount: amount,
      recipient: account,
      deployWalletValue: 0,
      remainingGasTo: auditor,
      notify: false,
      payload: ""
    })
    .send({ from: auditor, amount: toNano(1) });
  return tx;
}

export function fromNano(value, decimals = 9) {
  return (value / 10 ** decimals).toString();
}

export function toNano(value, decimals = 9) {
  return (value * 10 ** decimals).toString();
}

export function toAddress(address) {
  return new Address(address);
}
