import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreateClientePFDto {
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  readonly cpf: string;

  @IsString()
  @IsNotEmpty()
  readonly endereco: string;

  @IsDecimal()
  @IsNotEmpty()
  readonly rendaAnual: number;
}
