import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';

// Import the API
import { ApiPromise } from '@polkadot/api';

@Injectable()
export class ApiService {
  async getLatestBlock() {
    // Here we don't pass the (optional) provider, connecting directly to the default
    // node/port, i.e. `ws://127.0.0.1:9944`. Await for the isReady promise to ensure
    // the API has connected to the node and completed the initialisation process
    const api = await ApiPromise.create();

    // We only display a couple, then unsubscribe
    let result: string = '';

    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
      result = `Chain is at block: #${header.number}`;
      unsubscribe();
    });

    // Return the total current latest block height
    return result;
  }

  async createWallet(data: CreateWalletDto) {
    const { mnemonicGenerate } = require('@polkadot/util-crypto');
    const { Keyring } = require('@polkadot/api');

    // generate a random mnemonic, 12 words in length
    const mnemonic = mnemonicGenerate(12);

    // Create an instance of the Keyring
    // Using standard Polkadot/Substrate chains `sr25519`
    // The ss58Format will be used to format addresses, XODE blockchain uses `280`
    // These are the only rules needed for creating address
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 280 });

    // Add mnemonic to the keyring with the name parameter
    const pair = keyring.addFromUri(mnemonic, { name: data.name });

    // Returns the created wallet address and it's mnemonic
    return { address: pair.address, mnemonic };
  }
}
