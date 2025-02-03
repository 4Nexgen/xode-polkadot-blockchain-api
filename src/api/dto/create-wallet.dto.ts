import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiPropertyOptional({
    description: 'Name of the wallet',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
