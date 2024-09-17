import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cliente_pf')
export class ClientePF {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @Column('decimal')
  rendaAnual: number;
}
