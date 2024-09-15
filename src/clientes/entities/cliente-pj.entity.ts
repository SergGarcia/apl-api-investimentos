// cliente-pj.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { CNPJ } from './cnpj.entity'; // Ajuste o caminho conforme necessário

@Entity('cliente_pj')
export class ClientePJ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @ManyToMany(() => CNPJ)
  @JoinTable()
  cnpjs: CNPJ[];

  @Column()
  endereco: string;

  @Column('decimal')
  faturamentoAnual: number;
}