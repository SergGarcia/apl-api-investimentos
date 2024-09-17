import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CadastroInvestimentoDto } from './dto/cadastro-investimento.dto';
import { ProdutoInvestimentoDto } from './dto/investimento-response.dto';
import { ClienteService } from '../clientes/cliente.service';
import { ClientePF } from 'src/clientes/entities/cliente-pf.entity';
import { ClientePJ } from 'src/clientes/entities/cliente-pj.entity';
import { ClienteTipo } from '../shared/cliente-tipo.enum';
@Injectable()
export class ProdutoInvestimentoService {
  constructor(private readonly clienteService: ClienteService) {}

  private readonly produtos: ProdutoInvestimentoDto[] = [
    { id: 1, nome: 'Produto A', descricao: 'Descrição do Produto A', valorMinimo: 1000, tipoCliente: ClienteTipo.PF, taxaRetorno: 5, dataVencimento: new Date('2025-12-31') },
    { id: 2, nome: 'Produto B', descricao: 'Descrição do Produto B', valorMinimo: 2000, tipoCliente: ClienteTipo.PJ, taxaRetorno: 6, dataVencimento: new Date('2026-01-15') },
    { id: 3, nome: 'Produto C', descricao: 'Descrição do Produto C', valorMinimo: 1500, tipoCliente: ClienteTipo.AMBOS, taxaRetorno: 4.5, dataVencimento: new Date('2024-11-30') },
    { id: 4, nome: 'Produto D', descricao: 'Descrição do Produto D', valorMinimo: 2500, tipoCliente: ClienteTipo.AMBOS, taxaRetorno: 5.8, dataVencimento: new Date('2025-10-01') },
  ];

  private readonly clienteInvestimentos: { [key: string]: CadastroInvestimentoDto[] } = {
    "1c0e9d9b-6762-41b8-96ce-11cdb87357bf": [
      { 
        clienteId: "1c0e9d9b-6762-41b8-96ce-11cdb87357bf",  
        produtoId: 1, 
        valorAplicado: 1200, 
        cpf: '123.456.789-00', 
        cnpj: null, 
        dataContratacao: new Date('2024-09-10 11:00:00'), 
        canalCliente: 'Mobile' 
      },
      { 
        clienteId: "1c0e9d9b-6762-41b8-96ce-11cdb87357bf",  
        produtoId: 3, 
        valorAplicado: 1600, 
        cpf: '123.456.789-00', 
        cnpj: null, 
        dataContratacao: new Date('2024-09-10 11:00:00'), 
        canalCliente: 'Internet banking' 
      },
    ],
    "c5744427-5ded-4ab9-8eea-1108bb8228f4": [
      { 
        clienteId: "c5744427-5ded-4ab9-8eea-1108bb8228f4",  
        produtoId: 2, 
        valorAplicado: 2200, 
        cpf: null, 
        cnpj: '12.345.678/0001-90', 
        dataContratacao: new Date('2024-09-10 11:00:00'), 
        canalCliente: 'Mobile' 
      },
      { 
        clienteId: "c5744427-5ded-4ab9-8eea-1108bb8228f4",  
        produtoId: 4, 
        valorAplicado: 2700, 
        cpf: null, 
        cnpj: '12.345.678/0002-80', 
        dataContratacao: new Date('2024-09-10 11:00:00'), 
        canalCliente: 'Internet banking' 
      },
    ],
  };

  findAll(): ProdutoInvestimentoDto[] {
    return this.produtos;
  }

  findByTipoCliente(tipoCliente: ClienteTipo): ProdutoInvestimentoDto[] {
    return this.produtos.filter(produto =>
      produto.tipoCliente === ClienteTipo.AMBOS || produto.tipoCliente === tipoCliente
    );
  }

  getInvestimentosPorCliente(clienteId: string): (ProdutoInvestimentoDto & { dadosContratacao: CadastroInvestimentoDto })[] {
    const clienteInvestimentos = this.clienteInvestimentos[clienteId] || [];
    const produtoIds = clienteInvestimentos.map(investimento => investimento.produtoId);
    return this.produtos
      .filter(produto => produtoIds.includes(produto.id))
      .map(produto => {
        const dados = clienteInvestimentos.find(investimento => investimento.produtoId === produto.id);
        return {
          ...produto,
          dadosContratacao: dados,
        };
      });
  }

  cadastrarInvestimento(clienteId: string, produtoId: number, valorAplicado: number, cpf?: string, cnpj?: string) {
    let clientePF: ClientePF | undefined;
    let clientePJ: ClientePJ | undefined;

    // Verifica se o cliente é PF ou PJ com base no CPF ou CNPJ
    if (cpf) {
      clientePF = this.clienteService.findOnePF(clienteId);
      if (!clientePF) {
        throw new NotFoundException(`Cliente PF com id ${clienteId} não encontrado.`);
      }
    } else if (cnpj) {
      clientePJ = this.clienteService.findOnePJ(clienteId);
      if (!clientePJ) {
        throw new NotFoundException(`Cliente PJ com id ${clienteId} não encontrado.`);
      }
    }

    // Busca o produto de investimento
    const produto = this.produtos.find(p => p.id === produtoId);
    if (!produto) {
      throw new NotFoundException(`Produto de investimento com id ${produtoId} não encontrado.`);
    }

    // Verifica se o produto é compatível com o tipo de cliente
    if (produto.tipoCliente === ClienteTipo.PF && !clientePF) {
      throw new BadRequestException(`Produto ${produtoId} disponível apenas para clientes PF.`);
    }
    if (produto.tipoCliente === ClienteTipo.PJ && !clientePJ) {
      throw new BadRequestException(`Produto ${produtoId} disponível apenas para clientes PJ.`);
    }

    // Validação de regra para PF
    if (clientePF) {
      const totalAplicado = (this.clienteInvestimentos[clienteId] || [])
        .filter(inv => inv.produtoId === produto.id)
        .reduce((acc, curr) => acc + curr.valorAplicado, 0);

      if (totalAplicado + valorAplicado > clientePF.rendaAnual * 0.1) {
        throw new BadRequestException(`Valor total aplicado excede 10% da renda anual do cliente PF.`);
      }
    }

    // Validação de regra para PJ
    if (clientePJ) {
      const totalAplicado = (this.clienteInvestimentos[clienteId] || [])
        .filter(inv => inv.produtoId === produto.id)
        .reduce((acc, curr) => acc + curr.valorAplicado, 0);

      if (totalAplicado + valorAplicado > clientePJ.faturamentoAnual * 0.2) {
        throw new BadRequestException(`Valor total aplicado excede 20% do faturamento anual do cliente PJ.`);
      }
    }

    // Adiciona o novo investimento
    const novoInvestimento: CadastroInvestimentoDto = {
      clienteId,
      produtoId,
      valorAplicado,
      cpf,
      cnpj,
      dataContratacao: new Date(), 
      canalCliente: 'Web' 
    };

    if (!this.clienteInvestimentos[clienteId]) {
      this.clienteInvestimentos[clienteId] = [];
    }
    
    this.clienteInvestimentos[clienteId].push(novoInvestimento);
    return novoInvestimento;
  }
}
