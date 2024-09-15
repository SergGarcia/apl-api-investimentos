// cnpj.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cnpj')
export class CNPJ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnpj: string;
}
