import { ClienteTipo } from '../../shared/cliente-tipo.enum';

  export class ProdutoInvestimentoDto {
    id: number;
    nome: string;
    descricao: string;
    valorMinimo: number;
    tipoCliente: ClienteTipo;
    taxaRetorno: number;  
    dataVencimento: Date;  
  }
  