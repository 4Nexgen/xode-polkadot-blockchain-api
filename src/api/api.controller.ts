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

  @Post('create-walet')
  async createWallet(@Body() body: CreateWalletDto) {
    return await this.apiService.createWallet(body);
  }

  @Get('latest-block')
  @ApiOperation({ description: 'Get the current latest block height' })
  @ApiResponse({ status: 200, description: 'Success query result.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getLatestBlock() {
    return await this.apiService.getLatestBlock();
  }

  @Get(':block_number')
  @ApiOperation({
    summary: 'Get events for a specific block',
    description:
      'Fetches all events associated with a specific block number in the Polkadot blockchain.',
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
  @Get('transactions/:block_number')
  async getTransactionDetails(
    @Param('block_number', ParseIntPipe) block_number: number,
  ) {
    return await this.apiService.getTransactionDetails(block_number);
  }
}
