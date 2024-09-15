import { Injectable } from '@nestjs/common';
import { InvestimentoResponseDto } from './dto/investimento-response.dto';

@Injectable()
export class InvestimentoService {
  private investimentos = [
    {
      id: 1,
      name: 'Investimento A',
      rate: 7.5,
      riskLevel: 'Baixo',
      term: '6 meses',
      minimumValue: 1000,
    },
    {
      id: 2,
      name: 'Investimento B',
      rate: 9.0,
      riskLevel: 'Médio',
      term: '1 ano',
      minimumValue: 5000,
    },
    {
      id: 3,
      name: 'Investimento C',
      rate: 12.5,
      riskLevel: 'Alto',
      term: '2 anos',
      minimumValue: 10000,
    },
  ];

  findAll(): InvestimentoResponseDto[] {
    return this.investimentos;
  }
}
