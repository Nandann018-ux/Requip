import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Email, Aadhaar, and PAN are immutable after creation to preserve audit integrity
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'aadhaarNumber', 'panNumber'] as const),
) {}
