import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BebaUser } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { BebaBabyParent } from '../../../../entities/baby-parent.entity';
import { UserProfile } from '../../../../dtos/userProfile';
import { LoginRequest } from '../../../../dtos/loginRequest';
import { Result } from '../../../../dtos/results';
import { UserTypesEnum } from '../../../../enums/user-type-enum';
import { LoginResponse, ParentSignUpRequest } from '../../../../dtos/models';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { md5 } from '../../../../_helper/md5';
import { codes } from '../../../../codes';

describe('AuthService', () => {
  let authService: AuthService;
  let bebaUserRepo: Repository<BebaUser>;
  let bebaBabyPermissionRepo: Repository<BebaBabyParent>;
  let jwtService: JwtService;
  let toEntityService: toEntity;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        toEntity,
        {
          provide: getRepositoryToken(BebaUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BebaBabyParent),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BebaUser),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    bebaUserRepo = module.get<Repository<BebaUser>>(getRepositoryToken(BebaUser));
    bebaBabyPermissionRepo = module.get<Repository<BebaBabyParent>>(getRepositoryToken(BebaBabyParent));
    jwtService = module.get<JwtService>(JwtService);
    toEntityService = module.get<toEntity>(toEntity);
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('test@test.com', 'password');

      expect(result).toBeNull();
    });

    it('should return UserProfile if user found and password matches', async () => {
      const user = new BebaUser();
      user.Id = "guid";
      user.Email = 'test@test.com';
      user.Password = 'password';
      user.Name = 'password';
      user.Age = 20;
      user.Type = UserTypesEnum.PARENT;
      user.SubscribeToMarketing = true;

      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue(user);

      const result = await authService.validateUser('test@test.com', 'password');

      expect(result).toBeDefined();
      //expect(result).toBeInstanceOf(UserProfile);
      expect(result.Id).toBe(user.Id);
      expect(result.Email).toBe(user.Email);
      expect(result.Name).toBe(user.Name);
      expect(result.Age).toBe(user.Age);
      expect(result.Type).toBe(user.Type);
      expect(result.SubscribeToMarketing).toBe(user.SubscribeToMarketing);
    });

    it('should return null if user found but password does not match', async () => {
      const user = new BebaUser();
      user.Id = "121";
      user.Email = 'test@test.com';
      user.Password = 'password';

      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue(user);

      const result = await authService.validateUser('test@test.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a Result with isSuccess=false if validateUser returns null', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const loginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'password123',
      };

      const result = await authService.login(loginRequest);

      expect(result).toEqual(new Result());
    });

    it('should return a Result with isSuccess=true and a LoginResponse if validateUser returns a UserProfile', async () => {
      const userProfile: UserProfile = {
        Id: 'guid',
        Name: 'Test User',
        Email: 'test@test.com',
        Age: 20,
        SubscribeToMarketing: true,
        Type: UserTypesEnum.PARENT,
        IsVerified: false
      };

      const loginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(userProfile);

      const mockToken = 'jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockToken);

      const expectedLoginResponse: LoginResponse = {
        name: 'Test User',
        jwt: 'jwt-token',
        isVerified: false
      };

      const result = await authService.login(loginRequest);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toEqual(expectedLoginResponse);
      expect(jwtService.sign).toHaveBeenCalledWith(
        userProfile
      );
    });
  });

  describe('register', () => {
    it('should return a success result if user is registered successfully', async () => {
      const user: ParentSignUpRequest = {
        name: 'test', email: 'test@test.com', password: 'password',
        age: 0,
        subscribeToMarketing: false
      };
      jest.spyOn(bebaUserRepo, 'exist').mockResolvedValue(false);
      jest.spyOn(bebaUserRepo, 'save').mockResolvedValue(new BebaUser);

      const result = await authService.register(user, 'localhost');

      const entity = toEntityService.create<BebaUser>(user);

      expect(bebaUserRepo.exist).toHaveBeenCalledWith({ where: { Email: user.email } });
      expect(result).toEqual(new Result(true));

      expect(bebaUserRepo.save).toHaveBeenCalledWith(entity);
    });

    it('should return an error result if user already exists', async () => {
      const user: ParentSignUpRequest = {
        name: 'test', email: 'test@test.com', password: 'password',
        age: 0,
        subscribeToMarketing: false
      };
      jest.spyOn(bebaUserRepo, 'exist').mockResolvedValue(true);

      const result = await authService.register(user, 'localhost');

      expect(bebaUserRepo.exist).toHaveBeenCalledWith({ where: { Email: user.email } });
      expect(result).toEqual(new Result(false));
    });
  });

  describe('verifyEmail', () => {
    const mockEmail = 'test@test.com';
    const mockPassword = 'password123';
    const mockName = 'John Doe';
    const age = 20;
    const mockId = 'test-id';

    it('should return true when email is verified successfully', async () => {
      // Mock the findOne function to return a user with matching email
      const mockedFindOne = jest.fn().mockResolvedValue({ Email: 'test@example.com', IsVerified: false });
      const mockedSave = jest.fn().mockResolvedValue(true);
      jest.mock('./yourModule', () => ({
        bebaUser: {
          findOne: mockedFindOne,
          save: mockedSave,
        },
      }));

      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue({
        Email: mockEmail,
        Password: mockPassword,
        Name: mockName,
        Age: age,
        Type: UserTypesEnum.DOCTOR,
        SubscribeToMarketing: true,
        Id: mockId,
        IsVerified: false
      });

      jest.spyOn(bebaUserRepo, 'save').mockResolvedValue(new BebaUser);

      // Call the function

      const expectedCode = md5(mockEmail + 'BebaToken23');
      const result = await authService.verifyEmail(mockEmail, expectedCode);

      // Verify the expected behavior
      expect(mockedFindOne).toHaveBeenCalledWith({ where: { Email: 'test@example.com' } });
      expect(mockedSave).toHaveBeenCalled();
      expect(result).toEqual(new Result(true));
    });

    it('should return false if user is already verified', async () => {
      // Mock the findOne function to return a verified user
      const mockedFindOne = jest.fn().mockResolvedValue({ Email: 'test@example.com', IsVerified: true });
      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue({
        Email: mockEmail,
        Password: mockPassword,
        Name: mockName,
        Age: age,
        Type: UserTypesEnum.DOCTOR,
        SubscribeToMarketing: true,
        Id: mockId,
        IsVerified: false
      });

      // Call the function
      const result = await authService.verifyEmail('test@example.com', 'expectedCode');

      // Verify the expected behavior
      expect(mockedFindOne).toHaveBeenCalledWith({ where: { Email: 'test@example.com' } });
      expect(result).toEqual(new Result(false));
    });

    it('should return false if the code is incorrect', async () => {
      // Mock the findOne function to return a user with matching email
      const mockedFindOne = jest.fn().mockResolvedValue({ Email: 'test@example.com', IsVerified: false });
      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue({
        Email: mockEmail,
        Password: mockPassword,
        Name: mockName,
        Age: age,
        Type: UserTypesEnum.DOCTOR,
        SubscribeToMarketing: true,
        Id: mockId,
        IsVerified: false
      });

      // Call the function with incorrect code
      const result = await authService.verifyEmail('test@example.com', 'incorrectCode');

      // Verify the expected behavior
      expect(mockedFindOne).toHaveBeenCalledWith({ where: { Email: 'test@example.com' } });
      expect(result).toEqual(new Result(false));
    });

    it('should return false and log an error if an exception is thrown', async () => {
      // Mock the findOne function to throw an error
      const mockedFindOne = jest.fn().mockRejectedValue(new Error('Database error'));
      console.error = jest.fn(); // Mock the console.error function

      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue({
        Email: mockEmail,
        Password: mockPassword,
        Name: mockName,
        Age: age,
        Type: UserTypesEnum.DOCTOR,
        SubscribeToMarketing: true,
        Id: mockId,
        IsVerified: false
      });

      // Call the function
      const result = await authService.verifyEmail('test@example.com', 'expectedCode');

      // Verify the expected behavior
      expect(mockedFindOne).toHaveBeenCalledWith({ where: { Email: 'test@example.com' } });
      expect(console.error).toHaveBeenCalledWith('Error verifying email', expect.any(Error), codes.VerifyEmailError);
      expect(result).toEqual(new Result(false));
    });
  });
});




