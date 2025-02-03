import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
}
