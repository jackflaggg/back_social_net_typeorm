import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    // https://typeorm.io/entities#special-columns
    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    // TODO: Нужно ли тут ставить дефолтное значение или же можно оставить так?
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt: Date | null;
}

// Новый базовый класс без deletedAt
export abstract class BaseEntityWithoutDeletedAt {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}
