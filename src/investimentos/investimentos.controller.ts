import { Controller, Get, Post, Body, Param, Query, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProdutoInvestimentoService } from './investimentos.service';
import { ProdutoInvestimentoDto } from './dto/investimento-response.dto';
import { CadastroInvestimentoDto } from './dto/cadastro-investimento.dto';
import { ProdutoInvestimentoQueryDto } from './dto/produto-investimento-query.dto';

@Controller('produtos')
export class ProdutoInvestimentoController {
  constructor(private readonly produtoInvestimentoService: ProdutoInvestimentoService) {}

  @Get()
  getProdutos(@Query() query: ProdutoInvestimentoQueryDto): ProdutoInvestimentoDto[] {
    if (query.tipoCliente) {
        return this.produtoInvestimentoService.findByTipoCliente(query.tipoCliente);
    }
        return this.produtoInvestimentoService.findAll();
  }

  @Get('investimentos/:clienteId')
  getInvestimentos(@Param('clienteId') clienteId: string): (ProdutoInvestimentoDto & { dadosContratacao: CadastroInvestimentoDto })[] {
    return this.produtoInvestimentoService.getInvestimentosPorCliente(clienteId);
  }

  @Post('investimentos')
  cadastrarInvestimento(@Body() dto: CadastroInvestimentoDto): Promise<CadastroInvestimentoDto> {
    const { clienteId, produtoId, valorAplicado, cpf, cnpj } = dto;
    return this.produtoInvestimentoService.cadastrarInvestimento(clienteId, produtoId, valorAplicado, cpf, cnpj);
  }

  @Delete(':clienteId/produto/:produtoId')
  async deleteInvestimento(
    @Param('clienteId') clienteId: string,
    @Param('produtoId') produtoId: number,
  ) {
    return this.produtoInvestimentoService.deleteInvestimento(clienteId, produtoId);
  }
}
