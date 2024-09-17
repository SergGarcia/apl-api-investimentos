import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; 
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
    { id: '1c0e9d9b-6762-41b8-96ce-11cdb87357bf', nome: 'João da Silva', cpf: '123.456.789-00', endereco: 'Rua A, 123', rendaAnual: 50000 },
    { id: 'b0ea3d38-a0d7-423c-9700-0ce7401f9ed8', nome: 'Maria Oliveira', cpf: '987.654.321-00', endereco: 'Avenida B, 456', rendaAnual: 75000 },
  ];

  private clientePJs: ClientePJ[] = [
    {
      id: 'c5744427-5ded-4ab9-8eea-1108bb8228f4',
      nome: 'Empresa LTDA',
      cnpjs: [
        { id: '2201f0de-37a8-4ba2-82b1-372d5765a61d', cnpj: '12.345.678/0001-90' },
        { id: 'b0ea3d38-a0d7-423c-9700-0ce7401f9ed8', cnpj: '12.345.678/0002-80' },
      ],
      endereco: 'Rua C, 789',
      faturamentoAnual: 1000000,
    },
    {
      id: uuidv4(),
      nome: 'Comércio S/A',
      cnpjs: [{ id: uuidv4(), cnpj: '98.765.432/0001-10' }],
      endereco: 'Avenida D, 101',
      faturamentoAnual: 2000000,
    },
  ];

  private cnpjs: CNPJ[] = [
    { id: uuidv4(), cnpj: '12.345.678/0001-90' },
    { id: uuidv4(), cnpj: '12.345.678/0002-80' },
    { id: uuidv4(), cnpj: '98.765.432/0001-10' },
  ];

  createPF(dto: CreateClientePFDto): ClientePF {
    const newClientePF: ClientePF = {
      id: uuidv4(), 
      ...dto,
    };
    this.clientePFs.push(newClientePF);
    return newClientePF;
  }

  findAllPF(): ClientePF[] {
    return this.clientePFs;
  }

  findOnePF(id: string): ClientePF {
    const clientePF = this.clientePFs.find(cpf => cpf.id === id);
    if (!clientePF) {
      throw new NotFoundException(`ClientePF com id ${id} não encontrado.`);
    }
    return clientePF;
  }

  updatePF(id: string, dto: UpdateClientePFDto): ClientePF {
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

  removePF(id: string): void {
    const clientePFIndex = this.clientePFs.findIndex(cpf => cpf.id === id);
    if (clientePFIndex === -1) {
      throw new NotFoundException(`ClientePF com id ${id} não encontrado.`);
    }
    this.clientePFs.splice(clientePFIndex, 1);
  }

  // CRUD para Cliente PJ

  createPJ(dto: CreateClientePJDto): ClientePJ {
    const cnpjs = dto.cnpjs.map(cnpjStr => {
      let cnpj = this.cnpjs.find(c => c.cnpj === cnpjStr);
      if (!cnpj) {
        cnpj = { id: uuidv4(), cnpj: cnpjStr };  
        this.cnpjs.push(cnpj);
      }
      return cnpj;
    });

    const newClientePJ: ClientePJ = {
      id: uuidv4(),
      ...dto,
      cnpjs,
    };
    this.clientePJs.push(newClientePJ);
    return newClientePJ;
  }

  findAllPJ(): ClientePJ[] {
    return this.clientePJs;
  }

  findOnePJ(id: string): ClientePJ {
    const clientePJ = this.clientePJs.find(cpj => cpj.id === id);
    if (!clientePJ) {
      throw new NotFoundException(`ClientePJ com id ${id} não encontrado.`);
    }
    return clientePJ;
  }

  updatePJ(id: string, dto: UpdateClientePJDto): ClientePJ {
    const clientePJIndex = this.clientePJs.findIndex(cpj => cpj.id === id);
    if (clientePJIndex === -1) {
      throw new NotFoundException(`ClientePJ com id ${id} não encontrado.`);
    }
    const updatedClientePJ = {
      ...this.clientePJs[clientePJIndex],
      nome: dto.nome,
      endereco: dto.endereco,
      faturamentoAnual: dto.faturamentoAnual,
    };

    if (dto.cnpjs) {
      const updatedCnpjs = dto.cnpjs.map(cnpjStr => {
        let cnpj = this.cnpjs.find(c => c.cnpj === cnpjStr);
        if (!cnpj) {
          cnpj = { id: uuidv4(), cnpj: cnpjStr };
          this.cnpjs.push(cnpj);
        }
        return cnpj;
      });
      updatedClientePJ.cnpjs = updatedCnpjs;
    }

    this.clientePJs[clientePJIndex] = updatedClientePJ;
    return updatedClientePJ;
  }

  removePJ(id: string): void {
    const clientePJIndex = this.clientePJs.findIndex(cpj => cpj.id === id);
    if (clientePJIndex === -1) {
      throw new NotFoundException(`ClientePJ com id ${id} não encontrado.`);
    }
    this.clientePJs.splice(clientePJIndex, 1);
  }
}
