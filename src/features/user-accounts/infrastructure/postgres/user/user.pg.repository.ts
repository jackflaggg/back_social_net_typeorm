import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '../../../domain/typeorm/user/user.entity';

@Injectable()
export class UserPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const query = `
        SELECT * 
        FROM users 
        WHERE "Email" = $1 OR "Login" = $1;
      `;
        const user = await this.dataSource.query(query, [loginOrEmail]);
        console.log(user);
        return user;
    }

    async createUser(newUser: User) {
        const queryUsers = `
     INSERT INTO "users" (Login, "Email", "CreatedAt", "PasswordHash") 
     VALUES ('${newUser.login}', '${newUser.email}', '${newUser.createdAt}', 
            '${newUser.passwordHash}')
      RETURNING "PK_User_id" as "id", Login as "login", "Email" as "email", "CreatedAt" as "createdAt"
    `;
        const user = await this.dataSource.query(queryUsers);
        return user[0];
    }

    async save(user: any): Promise<void> {
        await user.save();
    }
}