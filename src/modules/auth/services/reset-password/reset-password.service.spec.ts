import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordService } from './reset-password.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BebaUser } from '../../../../entities/user.entity';
import { ServeEmailerService } from '../../../../emails/email.sender';
import { BebaResetPassword } from '../../../../entities/reset-password.entity';
import { UserTypesEnum } from '../../../../enums/user-type-enum';
import { Result } from '../../../../dtos/results';
import { ChangePasswordRequest } from '../../../../dtos/changePasswordRequest';

describe('ResetPasswordService', () => {
  let resetPasswordService: ResetPasswordService;
  let bebaUserRepo: Repository<BebaUser | Error>;
  let bebaResetPasswordRepo: Repository<BebaResetPassword>;
  let serveEmailerService: ServeEmailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        ServeEmailerService,
        {
          provide: getRepositoryToken(BebaUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BebaResetPassword),
          useClass: Repository,
        },
      ],
    }).compile();

    resetPasswordService = module.get<ResetPasswordService>(
      ResetPasswordService,
    );
    bebaUserRepo = module.get<Repository<BebaUser | Error>>(
      getRepositoryToken(BebaUser),
    );
    bebaResetPasswordRepo = module.get<Repository<BebaResetPassword>>(
      getRepositoryToken(BebaResetPassword),
    );
    serveEmailerService = module.get<ServeEmailerService>(ServeEmailerService);
  });

  it('should be defined', () => {
    expect(bebaResetPasswordRepo).toBeDefined();
  });

  describe('step1', () => {
    const mockEmail = 'test@test.com';
    const mockPassword = 'password123';
    const mockName = 'John Doe';
    const age = 20;
    const mockId = 'test-id';


    beforeEach(() => {

      jest.spyOn(bebaResetPasswordRepo, 'save').mockResolvedValue({
        Id: mockId,
        Password: mockPassword,
        UserEmail: mockEmail
      });
      jest
        .spyOn(serveEmailerService, 'forgotPasswordEmail')
        .mockResolvedValue(undefined);
    });

    it('should send an email with the reset password link', async () => {
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
      const mockRequest = {
        email: mockEmail,
        newPassword: 'new-password-123',
      };
      const mockHost = 'localhost';

      const result = await resetPasswordService.step1(mockRequest, mockHost);

      expect(result.isSuccess).toBe(true);
      expect(serveEmailerService.forgotPasswordEmail).toHaveBeenCalledWith(
        mockHost,
        `Reset password`,
        mockName,
        mockEmail,
        `http://${mockHost}/auth/reset-password/${mockId}`,
      );
    });

    it('should return a failed result if user cannot be found', async () => {
      const mockRequest = {
        email: mockEmail,
        newPassword: 'new-password-123',
      };
      const mockHost = 'localhost';
      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue(undefined);

      const result = await resetPasswordService.step1(mockRequest, mockHost);

      expect(result.isSuccess).toBe(false);
      expect(serveEmailerService.forgotPasswordEmail).not.toHaveBeenCalled();
    });
  });

  describe('step2', () => {
    it('should reset password and delete reset password entry if reset entry exists', async () => {
      const verificationToken = 'abc123';

      const resetEntry = new BebaResetPassword();
      resetEntry.Id = verificationToken;
      resetEntry.Password = 'new-password';
      resetEntry.UserEmail = 'parent@example.com';

      const user = new BebaUser();
      user.Email = resetEntry.UserEmail;
      user.Password = 'old-password';

      jest.spyOn(bebaResetPasswordRepo, 'findOne').mockResolvedValue(resetEntry);
      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValue(user);
      jest.spyOn(bebaUserRepo, 'save').mockResolvedValue(user);
      jest.spyOn(bebaResetPasswordRepo, 'delete').mockResolvedValue(null);

      const result = await resetPasswordService.step2(verificationToken);

      expect(result).toEqual(new Result(true));
      expect(bebaUserRepo.save).toHaveBeenCalledWith(user);
      expect(bebaResetPasswordRepo.delete).toHaveBeenCalledWith(resetEntry);
    });

    it('should return false if reset entry does not exist', async () => {
      const verificationToken = 'abc123';

      jest.spyOn(bebaResetPasswordRepo, 'findOne').mockResolvedValue(undefined);

      const result = await resetPasswordService.step2(verificationToken);

      expect(result).toEqual(new Result(false));
    });
  });

  describe('changePassword', () => {
    it('should return false when user is not found', async () => {
      const changePasswordRequest: ChangePasswordRequest = {
        id: '1',
        oldPassword: 'oldPassword',
        newPassword: '123'
      };

      jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValueOnce(undefined);

      const result = await resetPasswordService.changePassword(changePasswordRequest);

      expect(result.isSuccess).toBe(false);
    });

    // it('should return false when old password does not match', async () => {
    //   const changePasswordRequest = {
    //     id: 1,
    //     oldPassword: 'oldPassword',
    //   };

    //   const bebaUserMock = {
    //     Id: 1,
    //     Password: 'differentPassword',
    //   };

    //   jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValueOnce(bebaUserMock);

    //   const result = await userService.changePassword(changePasswordRequest);

    //   expect(result.isSuccess).toBe(false);
    // });

    // it('should update password and return true when old password matches', async () => {
    //   const changePasswordRequest = {
    //     id: 1,
    //     oldPassword: 'oldPassword',
    //   };

    //   const bebaUserMock = {
    //     Id: 1,
    //     Password: md5('oldPassword'),
    //     save: jest.fn().mockResolvedValueOnce(undefined),
    //   };

    //   jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValueOnce(bebaUserMock);

    //   const result = await userService.changePassword(changePasswordRequest);

    //   expect(result.isSuccess).toBe(true);
    //   expect(bebaUserMock.Password).toBe(md5('oldPassword'));
    //   expect(bebaUserMock.save).toHaveBeenCalledTimes(1);
    // });

    // it('should return false when there is an error', async () => {
    //   const changePasswordRequest = {
    //     id: 1,
    //     oldPassword: 'oldPassword',
    //   };

    //   const bebaUserMock = {
    //     Id: 1,
    //     Password: md5('oldPassword'),
    //   };

    //   jest.spyOn(bebaUserRepo, 'findOne').mockResolvedValueOnce(bebaUserMock);
    //   jest.spyOn(bebaUserRepo, 'save').mockRejectedValueOnce(new Error('Test error'));

    //   const result = await userService.changePassword(changePasswordRequest);

    //   expect(result.isSuccess).toBe(false);
    // });
  });
});
