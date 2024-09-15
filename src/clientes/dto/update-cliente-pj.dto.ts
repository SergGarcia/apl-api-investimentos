// update-cliente-pj.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateClientePJDto } from './create-cliente-pj.dto';

export class UpdateClientePJDto extends PartialType(CreateClientePJDto) {}
