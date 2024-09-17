import { Module } from '@nestjs/common';
import { ProdutoInvestimentoService } from './investimentos.service';
import { ProdutoInvestimentoController } from './investimentos.controller';
import { ClienteModule } from '../clientes/clientes.module';

@Module({
imports: [ClienteModule],
  controllers: [ProdutoInvestimentoController],
  providers: [ProdutoInvestimentoService],
})
export class ProdutoInvestimentoModule {}