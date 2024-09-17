import { Module } from '@nestjs/common';
import { ProdutoInvestimentoModule } from './investimentos/investimentos.module';
import { ClienteModule } from './clientes/clientes.module';

@Module({
  imports: [ProdutoInvestimentoModule, ClienteModule],
})
export class AppModule {}
