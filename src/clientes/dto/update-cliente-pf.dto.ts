import { PartialType } from '@nestjs/mapped-types';
import { CreateClientePFDto } from './create-cliente-pf.dto';

export class UpdateClientePFDto extends PartialType(CreateClientePFDto) {}
