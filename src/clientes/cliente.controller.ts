// cliente.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClientePFDto } from './dto/create-cliente-pf.dto';
import { CreateClientePJDto } from './dto/create-cliente-pj.dto';
import { UpdateClientePFDto } from './dto/update-cliente-pf.dto';
import { UpdateClientePJDto } from './dto/update-cliente-pj.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  // Endpoints para Cliente PF

  @Post('pf')
  createPF(@Body() dto: CreateClientePFDto) {
    return this.clienteService.createPF(dto);
  }

  @Get('pf')
  findAllPF() {
    return this.clienteService.findAllPF();
  }

  @Get('pf/:id')
  findOnePF(@Param('id') id: number) {
    return this.clienteService.findOnePF(id);
  }

  @Put('pf/:id')
  updatePF(@Param('id') id: number, @Body() dto: UpdateClientePFDto) {
    return this.clienteService.updatePF(id, dto);
  }

  @Delete('pf/:id')
  removePF(@Param('id') id: number) {
    return this.clienteService.removePF(id);
  }

  // Endpoints para Cliente PJ

  @Post('pj')
  createPJ(@Body() dto: CreateClientePJDto) {
    return this.clienteService.createPJ(dto);
  }

  @Get('pj')
  findAllPJ() {
    return this.clienteService.findAllPJ();
  }

  @Get('pj/:id')
  findOnePJ(@Param('id') id: number) {
    return this.clienteService.findOnePJ(id);
  }

  @Put('pj/:id')
  updatePJ(@Param('id') id: number, @Body() dto: UpdateClientePJDto) {
    return this.clienteService.updatePJ(id, dto);
  }

  @Delete('pj/:id')
  removePJ(@Param('id') id: number) {
    return this.clienteService.removePJ(id);
  }
}
