import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn, 
} from "typeorm";
//import { User } from "./User";

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  movieName!: string;

  @Column()
  description!: string;

  @Column()
  directorName!: string;
 
  @Column()
  releaseDate!: string;

  @Column()
  creatorId!: number;
}
