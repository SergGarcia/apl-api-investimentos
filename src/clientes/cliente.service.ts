// cliente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientePFDto } from './dto/create-cliente-pf.dto';
import { CreateClientePJDto } from './dto/create-cliente-pj.dto';
import { UpdateClientePFDto } from './dto/update-cliente-pf.dto';
import { UpdateClientePJDto } from './dto/update-cliente-pj.dto';
import { ClientePF } from './entities/cliente-pf.entity';
import { ClientePJ } from './entities/cliente-pj.entity';
import { CNPJ } from './entities/cnpj.entity';

@Injectable()
export class ClienteService {
  private clientePFs: ClientePF[] = [
    { id: 1, nome: 'João da Silva', cpf: '123.456.789-00', endereco: 'Rua A, 123', rendaAnual: 50000 },
    { id: 2, nome: 'Maria Oliveira', cpf: '987.654.321-00', endereco: 'Avenida B, 456', rendaAnual: 75000 },
  ];

  private clientePJs: ClientePJ[] = [
    {
      id: 1,
      nome: 'Empresa LTDA',
      cnpjs: [
        { id: 1, cnpj: '12.345.678/0001-90' },
        { id: 2, cnpj: '12.345.678/0002-80' },
      ],
      endereco: 'Rua C, 789',
      faturamentoAnual: 1000000,
    },
    {
      id: 2,
      nome: 'Comércio S/A',
      cnpjs: [{ id: 3, cnpj: '98.765.432/0001-10' }],
      endereco: 'Avenida D, 101',
      faturamentoAnual: 2000000,
    },
  ];

  private cnpjs: CNPJ[] = [
    { id: 1, cnpj: '12.345.678/0001-90' },
    { id: 2, cnpj: '12.345.678/0002-80' },
    { id: 3, cnpj: '98.765.432/0001-10' },
  ];
  // CRUD para Cliente PF

  createPF(dto: CreateClientePFDto): ClientePF {
    const newClientePF: ClientePF = {
      id: this.clientePFs.length + 1,
      ...dto,
    };
    this.clientePFs.push(newClientePF);
    return newClientePF;
  }

  findAllPF(): ClientePF[] {
    return this.clientePFs;
  }

  findOnePF(id: number): ClientePF {
    const clientePF = this.clientePFs.find(cpf => cpf.id === id);
    if (!clientePF) {
      throw new NotFoundException(`ClientePF com id ${id} não encontrado.`);
    }
    return clientePF;
  }

  updatePF(id: number, dto: UpdateClientePFDto): ClientePF {
    const clientePFIndex = this.clientePFs.findIndex(cpf => cpf.id === id);
    if (clientePFIndex === -1) {
      throw new NotFoundException(`ClientePF com id ${id} não encontrado.`);
    }
    const updatedClientePF = {
      ...this.clientePFs[clientePFIndex],
      ...dto,
    };
    this.clientePFs[clientePFIndex] = updatedClientePF;
    return updatedClientePF;
  }

  removePF(id: number): void {
    const clientePFIndex = this.clientePFs.findIndex(cpf => cpf.id === id);
    if (clientePFIndex === -1) {
      throw new NotFoundException(`ClientePF com id ${id} não encontrado.`);
    }
    this.clientePFs.splice(clientePFIndex, 1);
  }

  // CRUD para Cliente PJ

  createPJ(dto: CreateClientePJDto): ClientePJ {
    // Cria ou recupera CNPJs
    const cnpjs = dto.cnpjs.map(cnpjStr => {
      let cnpj = this.cnpjs.find(c => c.cnpj === cnpjStr);
      if (!cnpj) {
        cnpj = { id: this.cnpjs.length + 1, cnpj: cnpjStr };
        this.cnpjs.push(cnpj);
      }
      return cnpj;
    });

    const newClientePJ: ClientePJ = {
      id: this.clientePJs.length + 1,
      ...dto,
      cnpjs,
    };
    this.clientePJs.push(newClientePJ);
    return newClientePJ;
  }

  findAllPJ(): ClientePJ[] {
    return this.clientePJs;
  }

  findOnePJ(id: number): ClientePJ {
    const clientePJ = this.clientePJs.find(cpj => cpj.id === id);
    if (!clientePJ) {
      throw new NotFoundException(`ClientePJ com id ${id} não encontrado.`);
    }
    return clientePJ;
  }

  updatePJ(id: number, dto: UpdateClientePJDto): ClientePJ {
    const clientePJIndex = this.clientePJs.findIndex(cpj => cpj.id === id);
    if (clientePJIndex === -1) {
      throw new NotFoundException(`ClientePJ com id ${id} não encontrado.`);
    }
    // Atualiza os dados principais
    const updatedClientePJ = {
      ...this.clientePJs[clientePJIndex],
      nome: dto.nome,
      endereco: dto.endereco,
      faturamentoAnual: dto.faturamentoAnual,
    };

    // Atualiza os CNPJs se houver
    if (dto.cnpjs) {
      const updatedCnpjs = dto.cnpjs.map(cnpjStr => {
        let cnpj = this.cnpjs.find(c => c.cnpj === cnpjStr);
        if (!cnpj) {
          cnpj = { id: this.cnpjs.length + 1, cnpj: cnpjStr };
          this.cnpjs.push(cnpj);
        }
        return cnpj;
      });
      updatedClientePJ.cnpjs = updatedCnpjs;
    }

    this.clientePJs[clientePJIndex] = updatedClientePJ;
    return updatedClientePJ;
  }

  removePJ(id: number): void {
    const clientePJIndex = this.clientePJs.findIndex(cpj => cpj.id === id);
    if (clientePJIndex === -1) {
      throw new NotFoundException(`ClientePJ com id ${id} não encontrado.`);
    }
    this.clientePJs.splice(clientePJIndex, 1);
  }
}
