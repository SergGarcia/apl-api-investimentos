import { IsEnum, IsOptional } from 'class-validator';
import { ClienteTipo } from '../../shared/cliente-tipo.enum';

export class ProdutoInvestimentoQueryDto {
  @IsEnum(ClienteTipo, {
    message: 'Tipo de cliente inválido. Valores permitidos: PF, PJ, AMBOS',
  })
  @IsOptional()
  tipoCliente?: ClienteTipo;
}