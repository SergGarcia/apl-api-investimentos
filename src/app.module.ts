import { Module } from '@nestjs/common';
import { InvestimentoModule } from './investimentos/investimentos.module';
import { ClienteModule } from './clientes/clientes.module';

@Module({
  imports: [InvestimentoModule, ClienteModule],
})
export class AppModule {}
