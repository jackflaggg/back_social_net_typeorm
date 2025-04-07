import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    @Index()
    deletedAt: Date | null;
}

export abstract class BaseEntityWithoutDeletedAt {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}

export abstract class BaseEntityWithoutDeletedAtAndCreatedAt {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}

export abstract class BaseEntityDeletedAtAndId {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    @Index()
    deletedAt: Date | null;
}
