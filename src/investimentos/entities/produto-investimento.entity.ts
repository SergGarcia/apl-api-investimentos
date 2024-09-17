import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ClienteTipo } from '../../shared/cliente-tipo.enum';


@Entity()
export class ProdutoInvestimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  valorMinimo: number;

  @Column({
    type: 'enum',
    enum: ClienteTipo,
    default: ClienteTipo.AMBOS,
  })
  tipoCliente: ClienteTipo;
}
