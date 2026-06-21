import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'Nandan', description: 'First name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({ example: 'Acharya', description: 'Last name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({ example: 'nandan@example.com', description: 'Unique email address' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: '9876543210', description: 'Primary mobile (Indian format: starts 6-9, 10 digits)' })
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Primary mobile must be a valid 10-digit Indian mobile number' })
  primaryMobile: string;

  @ApiPropertyOptional({ example: '9123456789', description: 'Secondary mobile number' })
  @IsOptional()
  @Matches(/^[6-9]\d{9}$/, { message: 'Secondary mobile must be a valid 10-digit Indian mobile number' })
  secondaryMobile?: string;

  @ApiProperty({ example: '123412341234', description: 'Aadhaar number (exactly 12 digits)' })
  @IsNotEmpty()
  @Matches(/^\d{12}$/, { message: 'Aadhaar number must be exactly 12 digits' })
  aadhaarNumber: string;

  @ApiProperty({ example: 'ABCDE1234F', description: 'PAN number' })
  @IsNotEmpty()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'PAN must be in format: ABCDE1234F' })
  panNumber: string;

  @ApiProperty({ example: '2000-01-15', description: 'Date of birth (YYYY-MM-DD, must be in past)' })
  @IsNotEmpty()
  @IsDateString({}, { message: 'Date of birth must be a valid date (YYYY-MM-DD)' })
  dateOfBirth: string;

  @ApiProperty({ example: 'Bangalore', description: 'Place of birth' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  placeOfBirth: string;

  @ApiProperty({ example: '123 MG Road, Bangalore, Karnataka 560001', description: 'Current address' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  currentAddress: string;

  @ApiProperty({ example: '456 Brigade Road, Bangalore, Karnataka 560001', description: 'Permanent address' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  permanentAddress: string;
}
