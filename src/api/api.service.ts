import { Injectable } from '@nestjs/common';

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
}
