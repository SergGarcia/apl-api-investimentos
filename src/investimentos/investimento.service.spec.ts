import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoInvestimentoService } from './investimentos.service';
import { ClienteService } from '../clientes/cliente.service';
import { ClienteTipo } from '../shared/cliente-tipo.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProdutoInvestimentoService', () => {
  let service: ProdutoInvestimentoService;
  let clienteService: ClienteService;

  const mockClienteService = () => ({
    findOnePF: jest.fn(),
    findOnePJ: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoInvestimentoService,
        { provide: ClienteService, useFactory: mockClienteService },
      ],
    }).compile();

    service = module.get<ProdutoInvestimentoService>(ProdutoInvestimentoService);
    clienteService = module.get<ClienteService>(ClienteService);
  });

  describe('findAll', () => {
    it('should return all produtos', () => {
      const result = service.findAll();
      expect(result).toEqual([
        { id: 1, nome: 'Produto A', descricao: 'Descrição do Produto A', valorMinimo: 1000, tipoCliente: ClienteTipo.PF, taxaRetorno: 5, dataVencimento: new Date('2025-12-31') },
        { id: 2, nome: 'Produto B', descricao: 'Descrição do Produto B', valorMinimo: 2000, tipoCliente: ClienteTipo.PJ, taxaRetorno: 6, dataVencimento: new Date('2026-01-15') },
        { id: 3, nome: 'Produto C', descricao: 'Descrição do Produto C', valorMinimo: 1500, tipoCliente: ClienteTipo.AMBOS, taxaRetorno: 4.5, dataVencimento: new Date('2024-11-30') },
        { id: 4, nome: 'Produto D', descricao: 'Descrição do Produto D', valorMinimo: 2500, tipoCliente: ClienteTipo.AMBOS, taxaRetorno: 5.8, dataVencimento: new Date('2025-10-01') },
      ]);
    });
  });

  describe('findByTipoCliente', () => {
    it('should return produtos by tipoCliente', () => {
      const result = service.findByTipoCliente(ClienteTipo.PF);
      expect(result).toEqual([
        { id: 1, nome: 'Produto A', descricao: 'Descrição do Produto A', valorMinimo: 1000, tipoCliente: ClienteTipo.PF, taxaRetorno: 5, dataVencimento: new Date('2025-12-31') },
        { id: 3, nome: 'Produto C', descricao: 'Descrição do Produto C', valorMinimo: 1500, tipoCliente: ClienteTipo.AMBOS, taxaRetorno: 4.5, dataVencimento: new Date('2024-11-30') },
        { id: 4, nome: 'Produto D', descricao: 'Descrição do Produto D', valorMinimo: 2500, tipoCliente: ClienteTipo.AMBOS, taxaRetorno: 5.8, dataVencimento: new Date('2025-10-01') },
      ]);
    });
  });

  describe('getInvestimentosPorCliente', () => {
    it('should return investimentos for a given cliente', () => {
      const result = service.getInvestimentosPorCliente('1c0e9d9b-6762-41b8-96ce-11cdb87357bf');
      expect(result).toEqual([
        { 
          id: 1, 
          nome: 'Produto A', 
          descricao: 'Descrição do Produto A', 
          valorMinimo: 1000, 
          tipoCliente: ClienteTipo.PF, 
          taxaRetorno: 5, 
          dataVencimento: new Date('2025-12-31'),
          dadosContratacao: { 
            clienteId: "1c0e9d9b-6762-41b8-96ce-11cdb87357bf", 
            produtoId: 1, 
            valorAplicado: 1200, 
            cpf: '123.456.789-00', 
            cnpj: null, 
            dataContratacao: new Date('2024-09-10 11:00:00'), 
            canalCliente: 'Mobile' 
          }
        },
        { 
          id: 3, 
          nome: 'Produto C', 
          descricao: 'Descrição do Produto C', 
          valorMinimo: 1500, 
          tipoCliente: ClienteTipo.AMBOS, 
          taxaRetorno: 4.5, 
          dataVencimento: new Date('2024-11-30'),
          dadosContratacao: { 
            clienteId: "1c0e9d9b-6762-41b8-96ce-11cdb87357bf", 
            produtoId: 3, 
            valorAplicado: 1600, 
            cpf: '123.456.789-00', 
            cnpj: null, 
            dataContratacao: new Date('2024-09-10 11:00:00'), 
            canalCliente: 'Internet banking' 
          }
        }
      ]);
    });
  });

  describe('cadastrarInvestimento', () => {
    it('should add a new investimento for PF cliente', async () => {
      clienteService.findOnePF = jest.fn().mockResolvedValue({ id: '1c0e9d9b-6762-41b8-96ce-11cdb87357bf', rendaAnual: 50000 });
      const result = await service.cadastrarInvestimento('1c0e9d9b-6762-41b8-96ce-11cdb87357bf', 1, 1000, '123.456.789-00');
      expect(result).toEqual({
        clienteId: '1c0e9d9b-6762-41b8-96ce-11cdb87357bf',
        produtoId: 1,
        valorAplicado: 1000,
        cpf: '123.456.789-00',
        cnpj: undefined,
        dataContratacao: expect.any(Date),
        canalCliente: 'Web',
      });
    });

    it('should add a new investimento for PJ cliente', async () => {
      clienteService.findOnePJ = jest.fn().mockResolvedValue({ id: 'c5744427-5ded-4ab9-8eea-1108bb8228f4', faturamentoAnual: 150000 });
      const result = await service.cadastrarInvestimento('c5744427-5ded-4ab9-8eea-1108bb8228f4', 2, 2200, undefined, '12.345.678/0001-90');
      expect(result).toEqual({
        clienteId: 'c5744427-5ded-4ab9-8eea-1108bb8228f4',
        produtoId: 2,
        valorAplicado: 2200,
        cpf: undefined,
        cnpj: '12.345.678/0001-90',
        dataContratacao: expect.any(Date),
        canalCliente: 'Web',
      });
    });

    it('should throw NotFoundException if cliente PF not found', async () => {
        clienteService.findOnePF = jest.fn().mockResolvedValue(null);
        
        await expect(service.cadastrarInvestimento('invalid-id', 1, 1200, '123.456.789-00'))
          .rejects
          .toThrow(NotFoundException);
      });

it('should throw NotFoundException if cliente PJ not found', async () => {
  clienteService.findOnePJ = jest.fn().mockResolvedValue(null); // Simula que o cliente PJ não foi encontrado

  await expect(service.cadastrarInvestimento('invalid-id', 2, 2200, undefined, '12.345.678/0001-90'))
    .rejects
    .toThrow(NotFoundException);
});

    it('should throw BadRequestException if investment exceeds PF limit', async () => {
      clienteService.findOnePF = jest.fn().mockResolvedValue({ id: '1c0e9d9b-6762-41b8-96ce-11cdb87357bf', rendaAnual: 12000 });
      service['clienteInvestimentos']['1c0e9d9b-6762-41b8-96ce-11cdb87357bf'] = [
        { clienteId: '1c0e9d9b-6762-41b8-96ce-11cdb87357bf', produtoId: 1, valorAplicado: 11000, cpf: '123.456.789-00', cnpj: null, dataContratacao: new Date(), canalCliente: 'Web' }
      ];
      await expect(service.cadastrarInvestimento('1c0e9d9b-6762-41b8-96ce-11cdb87357bf', 1, 2000, '123.456.789-00')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if investment exceeds PJ limit', async () => {
      clienteService.findOnePJ = jest.fn().mockResolvedValue({ id: 'c5744427-5ded-4ab9-8eea-1108bb8228f4', faturamentoAnual: 150000 });
      service['clienteInvestimentos']['c5744427-5ded-4ab9-8eea-1108bb8228f4'] = [
        { clienteId: 'c5744427-5ded-4ab9-8eea-1108bb8228f4', produtoId: 2, valorAplicado: 28000, cnpj: '12.345.678/0001-90', cpf: null, dataContratacao: new Date(), canalCliente: 'Web' }
      ];
      await expect(service.cadastrarInvestimento('c5744427-5ded-4ab9-8eea-1108bb8228f4', 2, 35000, undefined, '12.345.678/0001-90')).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteInvestimento', () => {
    it('should remove an investimento', () => {
        const clienteId = '1c0e9d9b-6762-41b8-96ce-11cdb87357bf';
        const produtoId = 1;
      
        // Obtém o estado inicial dos investimentos do cliente
        const investimentosAntes = service.getInvestimentosPorCliente(clienteId);
        const totalAntes = investimentosAntes.length;
      
        // Remove o investimento
        service.deleteInvestimento(clienteId, produtoId);
      
        // Obtém o estado após a remoção
        const investimentosDepois = service.getInvestimentosPorCliente(clienteId);
        const totalDepois = investimentosDepois.length;
      
        // Verifica se a quantidade de investimentos diminuiu
        expect(totalDepois).toBe(totalAntes - 1);
      
        // Verifica se o investimento com o produtoId correto foi removido
        expect(investimentosDepois.find(inv => inv.id === produtoId)).toBeUndefined();
      });
      

    it('should throw NotFoundException if no investimentos found for cliente', () => {
      service['clienteInvestimentos'] = {};
      expect(() => service.deleteInvestimento('invalid-id', 1)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException if investimento to delete is not found', () => {
      service['clienteInvestimentos'] = {
        '1c0e9d9b-6762-41b8-96ce-11cdb87357bf': []
      };
      expect(() => service.deleteInvestimento('1c0e9d9b-6762-41b8-96ce-11cdb87357bf', 1)).toThrow(NotFoundException);
    });
  });
});
