import { Controller, Get } from '@nestjs/common';
import { InvestimentoService } from './investimentos.service';
import { InvestimentoResponseDto } from './dto/investimento-response.dto';

@Controller('investimentos')
export class InvestimentoController {
  constructor(private readonly investimentoService: InvestimentoService) {}

  @Get()
  getInvestimentos(): InvestimentoResponseDto[] {
    return this.investimentoService.findAll();
  }
}
