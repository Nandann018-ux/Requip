import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`User with id '${id}' not found`);
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email '${email}' already exists`);
  }
}

export class AadhaarAlreadyExistsException extends ConflictException {
  constructor() {
    super('User with this Aadhaar number already exists');
  }
}

export class PanAlreadyExistsException extends ConflictException {
  constructor() {
    super('User with this PAN number already exists');
  }
}

export class UserAlreadyDeletedException extends BadRequestException {
  constructor(id: string) {
    super(`User with id '${id}' is already deleted`);
  }
}
