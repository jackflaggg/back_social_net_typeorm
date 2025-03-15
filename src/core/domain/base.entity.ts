import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    // https://typeorm.io/entities#special-columns
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt: Date | null;
}
