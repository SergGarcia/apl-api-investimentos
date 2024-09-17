import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDate } from 'class-validator';

export class CadastroInvestimentoDto {
  @IsNotEmpty()
  @IsNumber()
  clienteId: string;

  @IsNotEmpty()
  @IsNumber()
  produtoId: number;

  @IsNotEmpty()
  @IsNumber()
  valorAplicado: number;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsNotEmpty()
  @IsDate()
  dataContratacao: Date;

  @IsNotEmpty()
  @IsString()
  canalCliente: string;
}
