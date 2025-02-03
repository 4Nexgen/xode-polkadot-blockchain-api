import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class ApiService {
  async createWallet(data: CreateWalletDto) {
    const { mnemonicGenerate } = require('@polkadot/util-crypto');
    const { Keyring } = require('@polkadot/api');

    try {
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
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getLatestBlock() {
    // Here we don't pass the (optional) provider, connecting directly to the default
    // node/port, i.e. `ws://127.0.0.1:9944`. Await for the isReady promise to ensure
    // the API has connected to the node and completed the initialisation process
    const { ApiPromise, WsProvider } = require('@polkadot/api');

    // Initialize the provider
    const provider = new WsProvider(
      'wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc',
    );

    // Create the API instance
    const api = await ApiPromise.create({ provider });

    // We only display a couple, then unsubscribe
    let result: string = '';

    try {
      // Subscribe to the new headers on-chain. The callback is fired when new headers
      // are found, the call itself returns a promise with a subscription that can be
      // used to unsubscribe from the newHead subscription
      const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
        result = `Chain is at block: #${header.number}`;
        unsubscribe();
      });

      // Return the total current latest block height
      return result;
    } catch (error) {
      console.error('Error fetching block', error);
      throw new Error(`Failed to fetch block ${error.message}`);
    } finally {
      // Disconnect the API
      await api.disconnect();
    }
  }

  async getBlockTransactions(block_number: number): Promise<any[]> {
    const { ApiPromise, WsProvider } = require('@polkadot/api');

    // Initialize the provider
    const provider = new WsProvider(
      'wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc',
    );

    // Create the API instance
    const api = await ApiPromise.create({ provider });

    try {
      // Fetch the block hash for the given block number
      const blockHash = await api.rpc.chain.getBlockHash(block_number);

      // Fetch the events for the block
      const events = await api.query.system.events.at(blockHash);

      // Array to store the formatted events
      const formattedEvents = [];

      // Loop through the events
      events.forEach((record) => {
        const { event, phase } = record;
        const types = event.typeDef;

        // Object to store event details
        const eventDetails = {
          section: event.section,
          method: event.method,
          phase: phase.toString(),
          data: [] as { type: string; value: string }[],
        };

        // Loop through the event parameters
        event.data.forEach((data: any, index: number) => {
          eventDetails.data.push({
            type: types[index].type,
            value: data.toString(),
          });
        });

        // Add the event details to the array
        formattedEvents.push(eventDetails);
      });

      // Return the formatted events
      return formattedEvents;
    } catch (error) {
      console.error('Error fetching block events:', error);
      throw new Error(`Failed to fetch block events: ${error.message}`);
    } finally {
      // Disconnect the API
      await api.disconnect();
    }
  }

  async getTransactionDetails(block_number: number) {
    const { ApiPromise, WsProvider } = require('@polkadot/api');

    // Initialize the provider
    const provider = new WsProvider(
      'wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc',
    );

    // Create the API instance
    const api = await ApiPromise.create({ provider });

    try {
      const blockHash = await api.rpc.chain.getBlockHash(block_number);

      // Get the block details
      const signedBlock = await api.rpc.chain.getBlock(blockHash);

      const formattedEvents = [];
      // Extract extrinsics
      signedBlock.block.extrinsics.forEach((extrinsic) => {
        formattedEvents.push(extrinsic.toHuman());
      });

      return formattedEvents;
    } catch (error) {
      console.error('Error fetching block events:', error);
      throw new Error(`Failed to fetch block events: ${error.message}`);
    } finally {
      // Disconnect the API
      await api.disconnect();
    }
  }
}
