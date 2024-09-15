import { Module } from '@nestjs/common';
import { InvestimentoService } from './investimentos.service';
import { InvestimentoController } from './investimentos.controller';

@Module({
  controllers: [InvestimentoController],
  providers: [InvestimentoService],
})
export class InvestimentoModule {}
