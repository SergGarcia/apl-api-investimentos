import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClientePFDto } from './dto/create-cliente-pf.dto';
import { UpdateClientePFDto } from './dto/update-cliente-pf.dto';
import { CreateClientePJDto } from './dto/create-cliente-pj.dto';
import { UpdateClientePJDto } from './dto/update-cliente-pj.dto';
import { ClientePF } from './entities/cliente-pf.entity';
import { ClientePJ } from './entities/cliente-pj.entity';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  // Cliente PF

  @Post('pf')
  createPF(@Body() createClientePFDto: CreateClientePFDto): ClientePF {
    return this.clienteService.createPF(createClientePFDto);
  }

  @Get('pf')
  findAllPF(): ClientePF[] {
    return this.clienteService.findAllPF();
  }

  @Get('pf/:id')
  findOnePF(@Param('id') id: string): ClientePF {
    return this.clienteService.findOnePF(id);
  }

  @Put('pf/:id')
  updatePF(@Param('id') id: string, @Body() updateClientePFDto: UpdateClientePFDto): ClientePF {
    return this.clienteService.updatePF(id, updateClientePFDto);
  }

  @Delete('pf/:id')
  removePF(@Param('id') id: string): void {
    return this.clienteService.removePF(id);
  }

  // Cliente PJ

  @Post('pj')
  createPJ(@Body() createClientePJDto: CreateClientePJDto): ClientePJ {
    return this.clienteService.createPJ(createClientePJDto);
  }

  @Get('pj')
  findAllPJ(): ClientePJ[] {
    return this.clienteService.findAllPJ();
  }

  @Get('pj/:id')
  findOnePJ(@Param('id') id: string): ClientePJ {
    return this.clienteService.findOnePJ(id);
  }

  @Put('pj/:id')
  updatePJ(@Param('id') id: string, @Body() updateClientePJDto: UpdateClientePJDto): ClientePJ {
    return this.clienteService.updatePJ(id, updateClientePJDto);
  }

  @Delete('pj/:id')
  removePJ(@Param('id') id: string): void {
    return this.clienteService.removePJ(id);
  }
}
