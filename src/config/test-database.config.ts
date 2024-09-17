import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity'; // Ajusta según tu estructura
import { PermissionEntity } from '../entities/permissions.entity';
import { RoleEntity } from '../entities/roles.entity';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [UserEntity, PermissionEntity, RoleEntity], // Incluye todas las entidades necesarias aquí
  synchronize: true,
  logging: false,
};