// create-cliente-pj.dto.ts
import { IsString, IsNotEmpty, IsDecimal, IsArray } from 'class-validator';

export class CreateClientePJDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsArray()
  @IsString({ each: true })
  cnpjs: string[];

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsDecimal()
  faturamentoAnual: number;
}
