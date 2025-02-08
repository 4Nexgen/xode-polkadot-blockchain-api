import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiTags, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateWalletDto } from './dto/create-wallet.dto';

@ApiTags('API')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /**
   * API endpoint to create a new blockchain wallet.
   *
   * @param {CreateWalletDto} body - The data for wallet creation.
   * @returns {Promise<{ address: string; mnemonic: string }>} - The created wallet details.
   * @throws {InternalServerErrorException} - If wallet creation fails.
   */
  @Post('create-wallet')
  @ApiOperation({
    summary: 'Creates new wallet address',
    description: 'Generate a new wallet with an address and mnemonic',
  })
  @ApiResponse({ status: 201, description: 'Wallet successfully created.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createWallet(
    @Body() body: CreateWalletDto,
  ): Promise<{ address: string; mnemonic: string }> {
    return await this.apiService.createWallet(body);
  }

  /**
   * API endpoint to get the latest block height from the blockchain.
   *
   * @returns {Promise<{ block: string }>} - The latest block height.
   * @throws {InternalServerErrorException} - If there is an error fetching the block.
   */
  @Get('latest-block')
  @ApiOperation({
    summary: 'Get the current latest block height.',
    description:
      'Returns a number that tells the latest block number of the blockchain',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the latest block height.',
    schema: { example: { block: '1' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while fetching block.',
  })
  async getLatestBlock(): Promise<{ block: string }> {
    return await this.apiService.getLatestBlock();
  }

  @Get(':block_number')
  @ApiOperation({
    summary: 'Get events for a specific block',
    description:
      'Fetches all events associated with a specific block number in the XODE blockchain.',
  })
  @ApiParam({
    name: 'block_number',
    type: Number,
    description: 'The block number to fetch events for.',
    example: 123456,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched block events.',
    schema: {
      example: [
        {
          section: 'balances',
          method: 'Transfer',
          phase: 'ApplyExtrinsic',
          data: [
            {
              type: 'AccountId',
              value: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
            },
            {
              type: 'AccountId',
              value: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
            },
            {
              type: 'Balance',
              value: '1000000000000',
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid block number provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getBlockEvents(
    @Param('block_number', ParseIntPipe) block_number: number,
  ) {
    return await this.apiService.getBlockTransactions(block_number);
  }

  @Get('transactions/:block_number')
  @ApiOperation({
    summary: 'Get details of a transaction from a block',
    description:
      'Fetches details of a transaction from the specified block number',
  })
  @ApiParam({
    name: 'block_number',
    type: Number,
    description: 'The block number to fetch events for.',
    example: 123456,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched block events.',
    schema: {
      example: [
        {
          isSigned: true,
          method: {
            args: {
              dest: {
                Id: '5CGDeeDXj9ZbYqdFK4dDQcYdTPxMAHk9mcjitbkfaF1NRd6x',
              },
              value: '4,000,000,000,000',
            },
            method: 'transferKeepAlive',
            section: 'balances',
          },
          assetId: null,
          era: {
            MortalEra: {
              period: '32',
              phase: '9',
            },
          },
          metadataHash: null,
          mode: null,
          nonce: '0',
          signature:
            '0xdc323db8704827e413ba6c610159d32d78aa761bdf54dc55990e319d4716607b9510d0e3ad171724bbe3060e69f4145f505bf279773f0fd615ea1967037f628d',
          signer: {
            Id: '5CJz4Eah6P6xWaXRZpkyAKqSk1gFzvEuswyW7xDwc1ebfr5P',
          },
          tip: '0',
          extrinsicHash:
            '0x7a1572842f6938a47ab76c0d83e9a0310b6c6cf189141d4c6353cab3211a3c9b',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid block number provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getTransactionDetails(
    @Param('block_number', ParseIntPipe) block_number: number,
  ) {
    return await this.apiService.getTransactionDetails(block_number);
  }

  @Get('transaction/:tx_hash')
  @ApiOperation({
    summary: 'Get details of a transaction from a `tx_hash`',
    description:
      'Fetches details of a transaction from the specified `tx_hash`',
  })
  @ApiParam({
    name: 'tx_hash',
    type: String,
    description: 'The specific transaction hash from `tx_hash`.',
    example:
      '0x6f8ed70fc3b0ed18d3310a7a0b8650f84d251e913941d8e9b06c36f7b306e8f5',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched transaction hash details.',
    schema: {
      example: [
        {
          transfers: [
            {
              extrinsicHash:
                '0x6f8ed70fc3b0ed18d3310a7a0b8650f84d251e913941d8e9b06c36f7b306e8f5',
              blockNumber: 1424678,
              timestamp: '2025-02-07T02:15:25.129000Z',
              amount: '1000000000000',
              fee: '1471148245',
              from: {
                id: '5E7Kr282poSkXJAd5v13BEntpxCASuhjPY3LMLEhLS3nqZoc',
              },
              to: {
                id: '5He4GqGDZRxnff2eSDuYYNqkBYVFmwyBfSy5FtXZeP6UNfVk',
              },
            },
          ],
          assetTransfers: [
            {
              extrinsicHash:
                '0x0debfe1aa6cfb718d971536821e37e8393a06b20079669ccd7ed7292f5a79f06',
              blockNumber: 1424784,
              timestamp: '2025-02-07T02:59:24.782000Z',
              amount: '1998289000000000000000',
              fee: '1511439476',
              asset: {
                id: '6',
                name: 'Private DON Token',
                symbol: 'IDON',
              },
              from: {
                id: '5CtecGsT4o8zDkHSJFsnoWwYuYmkuwW6Tm571vPbtXUNjWjF',
              },
              to: {
                id: '5H1c6G4JifmHXRNB5bNyrxw25USB4jBCzpzvFYx5hquUnBYe',
              },
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid `tx_hash` provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getTransactionHashDetails(@Param('tx_hash') tx_hash: string) {
    return await this.apiService.getTransactionHashDetails(tx_hash);
  }

  /**
   * API endpoint to retrieve the balance of a given wallet address.
   *
   * @param {string} address - The wallet address to query.
   * @returns {Promise<object>} - The account balance details.
   * @throws {BadRequestException} - If an invalid address format is provided.
   * @throws {InternalServerErrorException} - If fetching balance fails.
   */
  @Get('balance/:address')
  @ApiOperation({
    summary: 'Get address balance',
    description:
      'Fetches the native balance of the address in the XODE blockchain.',
  })
  @ApiParam({
    name: 'address',
    type: String,
    description: 'The wallet address whose balance needs to be fetched.',
    example: '5FJ9VWpubQXeiLKGcVmo3zD627UAJCiW6bupSUATeyNXTH1m',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the address balance.',
    schema: {
      example: {
        balance: {
          nonce: '2,226',
          consumers: '1',
          providers: '1',
          sufficients: '0',
          data: {
            free: '1,014,831,364',
            reserved: '9,690,965,000,000',
            frozen: '0',
            flags: '170,141,183,460,469,231,731,687,303,715,884,105,728',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid address provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getAddressBalance(@Param('address') address: string): Promise<object> {
    // Fetch balance details using the ApiService
    return await this.apiService.getAddressBalance(address);
  }
}
