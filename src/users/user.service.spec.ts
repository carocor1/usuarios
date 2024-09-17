import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '../jwt/jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity'; // Ajusta la ruta según tu estructura
import { testDatabaseConfig } from '../config/test-database.config'; // Ajusta la ruta según tu estructura
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDatabaseConfig),
        TypeOrmModule.forFeature([UserEntity]), // Incluye todas las entidades necesarias aquí
      ],
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: {
            generateToken: jest.fn().mockReturnValue('mockToken'),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Limpia la base de datos antes de cada prueba
    await module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity)).clear();
  });

  it('should return a user if found', async () => {
    // Agrega un usuario de prueba a la base de datos
    const user = new UserEntity();
    user.email = 'test@example.com';
    user.password = 'password'; // Usa hash en producción
    await service['repository'].save(user);

    // Llama al método findByEmail y verifica que se devuelva el usuario correcto
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

    const body = { email: 'notfound@example.com', password: 'password' };

    await expect(service.login(body)).rejects.toThrow(UnauthorizedException);
  });
});