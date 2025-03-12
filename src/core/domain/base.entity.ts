import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    // https://typeorm.io/entities#special-columns
    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
