import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class SearchUserDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by name, email, PAN, Aadhaar, or mobile' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  q?: string;
}
