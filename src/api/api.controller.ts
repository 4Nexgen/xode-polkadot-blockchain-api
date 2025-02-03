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

@ApiTags('API')
@Controller('api/latest-block')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @ApiOperation({ description: 'Get the current latest block height' })
  @ApiResponse({ status: 200, description: 'Success query result.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getLatestBlock() {
    return await this.apiService.getLatestBlock();
  }
}
