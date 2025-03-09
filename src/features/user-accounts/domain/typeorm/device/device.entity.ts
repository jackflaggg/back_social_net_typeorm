import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';

@Entity('security_device')
export class SecurityDevice extends BaseEntity {
    @PrimaryColumn()
    deviceId: string;

    @Column()
    deviceName: string;

    @Column()
    ip: string;

    @Column()
    userId: number;

    @Column({ type: 'timestamptz', nullable: true }) // nullable: true  важно!
    deletedAt: Date | null;

    @CreateDateColumn({ type: 'timestamptz' }) // default не нужен в TypeORM
    issuedAt: Date;

    @ManyToOne(() => User, user => user.securityDevices)
    @JoinColumn({ name: 'userId' })
    user: User;
}
