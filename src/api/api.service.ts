import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class ApiService {
  /**
   * Generates a new wallet with a mnemonic and address.
   *
   * @param {CreateWalletDto} data - The data containing the wallet name.
   * @returns {Promise<{ address: string; mnemonic: string }>} - The generated wallet address and mnemonic phrase.
   * @throws {Error} - Throws an error if wallet creation fails.
   */
  async createWallet(
    data: CreateWalletDto,
  ): Promise<{ address: string; mnemonic: string }> {
    const { mnemonicGenerate } = require('@polkadot/util-crypto');
    const { Keyring } = require('@polkadot/keyring');

    try {
      // Generate a random 12-word mnemonic phrase
      const mnemonic = mnemonicGenerate(12);

      // Create an instance of the Keyring
      // - Uses `sr25519` (default for Polkadot/Substrate chains)
      // - `ss58Format: 280` for XODE blockchain address format
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 280 });

      // Add mnemonic to the keyring and create a key pair
      const pair = keyring.addFromUri(mnemonic, { name: data.name });

      // Return the created wallet address and its mnemonic phrase
      return { address: pair.address, mnemonic };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error(`Wallet creation failed: ${error.message}`);
    }
  }

  /**
   * Retrieves the latest block number from the Polkadot-compatible blockchain.
   *
   * @async
   * @function getLatestBlock
   * @returns {Promise<{ block: string }>} - An object containing the latest block number.
   * @throws {Error} - Throws an error if the block retrieval fails.
   */
  async getLatestBlock(): Promise<{ block: string }> {
    const { ApiPromise, WsProvider } = require('@polkadot/api');

    // Define the WebSocket provider URL for the Polkadot node.
    const provider = new WsProvider(
      'wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc',
    );

    // Create the Polkadot API instance.
    const api = await ApiPromise.create({ provider });

    try {
      // Fetch the latest block number from the system module.
      const blockNumber = await api.query.system.number();

      // Return the latest block number.
      return { block: blockNumber.toString() };
    } catch (error) {
      console.error('Error fetching latest block:', error);
      throw new Error(`Failed to fetch latest block: ${error.message}`);
    } finally {
      // Ensure that the API connection is closed after execution.
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

  async getAddressBalance(address: string) {
    const { ApiPromise, WsProvider } = require('@polkadot/api');

    // Initialize the provider
    const provider = new WsProvider(
      'wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc',
    );

    // Create the API instance
    const api = await ApiPromise.create({ provider });

    try {
      const result = await api.query.system.account(address);
      return { balance: result.toHuman() };
    } catch (error) {
      console.error('Error fetching address balance:', error);
      throw new Error(`Failed to fetch address balance: ${error.message}`);
    } finally {
      // Disconnect the API
      await api.disconnect();
    }
  }
}
