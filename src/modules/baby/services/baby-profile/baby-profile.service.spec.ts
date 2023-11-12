import { Test, TestingModule } from '@nestjs/testing';
import { BabyProfileService } from './baby-profile.service';
import { Repository } from 'typeorm';
import { BebaBabySharedProfile } from '../../../../entities/shared-profile.entity';
import { BebaBaby } from '../../../../entities/baby.entity';
import { ServeEmailerService } from '../../../../emails/email.sender';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { ShareBabyRequest } from '../../../../dtos/shareBabyRequest';
import { Result } from '../../../../dtos/results';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BabyProfileService', () => {
  let service: BabyProfileService;
  let bebaBabySharedProfile: Repository<BebaBabySharedProfile>;
  let bebaBabyRepository: Repository<BebaBaby>;
  let mailerService: ServeEmailerService;
  let toEntityService: toEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BabyProfileService,
        toEntity,
        {
          provide: getRepositoryToken(BebaBabySharedProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BebaBaby),
          useClass: Repository,
        },
        {
          provide: ServeEmailerService,
          useValue: {
            sharedProfileEmail: jest.fn(() => ({ isSuccess: true })),
          },
        },
        toEntity,
      ],
    }).compile();

    service = module.get<BabyProfileService>(BabyProfileService);
    bebaBabySharedProfile = module.get<Repository<BebaBabySharedProfile>>(getRepositoryToken(BebaBabySharedProfile));
    bebaBabyRepository = module.get<Repository<BebaBaby>>(getRepositoryToken(BebaBaby));
    mailerService = module.get<ServeEmailerService>(ServeEmailerService);
    toEntityService = module.get<toEntity>(toEntity);
  });

  describe('shareProfile', () => {
    const babyId = '1';
    const shareRequest: ShareBabyRequest = {
      id: '2',
      email: 'test@test.com',
      permission: 'READ',
    };

    it('should save shared profile, send email, and return a successful result', async () => {
      bebaBabySharedProfile.save = jest.fn().mockResolvedValue(undefined);
      bebaBabyRepository.findOne = jest.fn().mockResolvedValue({ Name: 'Test Baby' });

      const result = await service.shareProfile(babyId, shareRequest);

      expect(bebaBabySharedProfile.save).toHaveBeenCalledWith({
        BabyId: babyId,
        Email: shareRequest.email,
        Permission: shareRequest.permission,
        Id: shareRequest.id,
      });
      expect(mailerService.sharedProfileEmail).toHaveBeenCalledWith(
        'Profile for Test Baby has been shared with you! ',
        shareRequest.email,
        shareRequest.email,
      );
      expect(result).toEqual(new Result(true));
    });

    it('should return an unsuccessful result and log an error when an error occurs', async () => {
      bebaBabySharedProfile.save = jest.fn().mockRejectedValue(new Error('Test error'));

      const result = await service.shareProfile(babyId, shareRequest);

      expect(bebaBabySharedProfile.save).toHaveBeenCalledWith({
        BabyId: babyId,
        Email: shareRequest.email,
        Permission: shareRequest.permission,
        Id: shareRequest.id,
      });
      expect(mailerService.sharedProfileEmail).not.toHaveBeenCalled();
      expect(result).toEqual(new Result(false));
    });
  });

  describe('lookupShared', () => {
    it('should return a list of shared baby profiles', async () => {
      const bebaBabySharedProfileData: BebaBabySharedProfile[] = [
        {
          BabyId: '1',
          Email: 'john@example.com',
          Permission: 'READ',
          Id: '1',
        },
        {
          BabyId: '1',
          Email: 'jane@example.com',
          Permission: 'READ-WRITE',
          Id: '2',
        },
      ];
      jest
        .spyOn(bebaBabySharedProfile, 'find')
        .mockResolvedValue(bebaBabySharedProfileData);

      const expectedResults = bebaBabySharedProfileData.map((x) => toEntityService.produce(x));

      const results = await service.lookupShared('1');

      expect(results).toEqual({ isSuccess: true, value: expectedResults });
    });

    it('should return a failed result when there is an error', async () => {
      jest
        .spyOn(bebaBabySharedProfile, 'find')
        .mockRejectedValueOnce(new Error('Something went wrong'));

      const result = await service.lookupShared('1');

      expect(result).toEqual(new Result(false));
    });
  });

  describe('deleteSharedAccess', () => {
    const profileId = '1';

    it('should delete shared access and return a successful result', async () => {
      const softDeleteMock = jest.fn().mockResolvedValue(undefined);
      jest.spyOn(bebaBabySharedProfile, 'softDelete').mockImplementation(softDeleteMock);

      const result = await service.deleteSharedAccess(profileId);

      expect(softDeleteMock).toHaveBeenCalledWith(profileId);
      expect(result).toEqual(new Result(true));
    });

    it('should return an unsuccessful result and log an error when an error occurs', async () => {
      const softDeleteMock = jest.fn().mockRejectedValue(new Error('Test error'));
      jest.spyOn(bebaBabySharedProfile, 'softDelete').mockImplementation(softDeleteMock);

      const result = await service.deleteSharedAccess(profileId);

      expect(softDeleteMock).toHaveBeenCalledWith(profileId);
      expect(result).toEqual(new Result(false));
    });
  });
});
