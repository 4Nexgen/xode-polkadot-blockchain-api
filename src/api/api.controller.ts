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
}
