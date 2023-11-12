import { Test } from '@nestjs/testing';
import { BabyInfoService } from './baby-info.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BebaBaby } from '../../../../entities/baby.entity';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { Result } from '../../../../dtos/results';
import { BabyRequest } from '../../../../dtos/models';
import { BebaBabySharedProfile } from '../../../../entities/shared-profile.entity';

describe('BabyInfoService', () => {
  let service: BabyInfoService;
  let bebaBabyRepository: Repository<BebaBaby>;
  let toEntityService: toEntity;
  let bebaBabySharedProfileRepository: Repository<BebaBabySharedProfile>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BabyInfoService,
        toEntity,
        {
          provide: getRepositoryToken(BebaBaby),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BebaBabySharedProfile),
          useClass: Repository,
        },

      ],
    }).compile();

    service = moduleRef.get<BabyInfoService>(BabyInfoService);
    bebaBabySharedProfileRepository = moduleRef.get<Repository<BebaBabySharedProfile>>(getRepositoryToken(BebaBabySharedProfile));
    bebaBabyRepository = moduleRef.get<Repository<BebaBaby>>(getRepositoryToken(BebaBaby));
    toEntityService = moduleRef.get<toEntity>(toEntity);
  });

  describe('addBaby', () => {
    it('should add a new baby', async () => {
      const babyRequest: BabyRequest = {
        picture: 'picture',
        name: 'John Doe', relationshipWithUser: "mother", DOB: "1996-01-01", gender: "Female", headCircumferenceAtBirth: 12, heightAtBirth: 12, weightAtBirth: 12, UserId: 'id1',
        relationship: 'mother'
      };
      const entity = new BebaBaby();
      jest.spyOn(bebaBabyRepository, 'save').mockResolvedValue(entity);
      const expected = toEntityService.create(babyRequest);

      const result = await service.addBaby(babyRequest);

      expect(bebaBabyRepository.save).toHaveBeenCalledWith(expected);
      expect(result).toEqual(new Result(true));
    });
  });

  describe('getProfile', () => {
    it('should return a Result object with success set to true when entity is found', async () => {

      const entity: BebaBaby = {
        Id: '123',
        Name: 'Baby',
        DOB: new Date('2020-01-30'),
        Gender: 'Male',
        HeadCircumferenceAtBirth: 20,
        HeightAtBirth: 23,
        RelationshipWithUser: '',
        UserId: "123",
        WeightAtBirth: 1,
        Picture: ''
      };

      const results = toEntityService.produce(entity);

      jest.spyOn(bebaBabyRepository, 'findOneBy').mockResolvedValue(entity);

      // Call the getProfile method with the ID of the entity we mocked above
      const result = await service.getProfile('1');

      // Expect the Result object to have success set to true
      expect(result).toEqual({
        isSuccess: true,
        value: results
      });
    });

    it('should return a Result object with success set to false when entity is not found', async () => {
      // Mock the findOneBy method to return undefined
      jest.spyOn(bebaBabySharedProfileRepository, 'find').mockResolvedValue([]);
      jest.spyOn(bebaBabyRepository, 'find').mockResolvedValue([]);

      // Call the getProfile method with a nonexistent ID
      const result = await service.getProfile('1');

      // Expect the Result object to have success set to false
      expect(result).toEqual(new Result(false));
    });

    // it('should return a Result object with success set to false when an error occurs', async () => {
    //   // Mock the findOneBy method to throw an error


    //   jest.spyOn(bebaBabyRepository, 'findOneBy').mockResolvedValue(new Error('Database error'));
    //   // Call the getProfile method with any ID
    //   const result = await service.getProfile('1');

    //   // Expect the Result object to have success set to false
    //   expect(result).toEqual(new Result<BabyProfileResponse>(false));
    // });
  });

  describe('lookupBabies', () => {
    it('should return an empty array when no matching babies are found', async () => {
      const mockedResult = [];
      jest.spyOn(bebaBabySharedProfileRepository, 'find').mockResolvedValue([]);
      jest.spyOn(bebaBabyRepository, 'find').mockResolvedValue([]);

      const result = await service.lookupBabies('123', 'email');

      expect(result.isSuccess).toBe(true);
      expect(result.value).toEqual([]);
    });

    // it('should return an array of BabyLookupItem objects when matching babies are found', async () => {
    //   const mockedResult = [
    //     { Id: '1', Name: 'Baby 1', UserId: '123' },
    //     { Id: '2', Name: 'Baby 2', UserId: '123' },
    //   ];
    //   jest.spyOn(bebaBabyRepository, 'createQueryBuilder').mockReturnValueOnce({
    //     leftJoinAndSelect: jest.fn().mockReturnThis(),
    //     where: jest.fn().mockReturnThis(),
    //     getMany: jest.fn().mockResolvedValueOnce(mockedResult),
    //   } as any);

    //   const result = await service.lookupBabies('123');

    //   expect(result.isSuccess).toBe(true);
    //   expect(result.value).toEqual([
    //     { id: '1', name: 'Baby 1' },
    //     { id: '2', name: 'Baby 2' },
    //   ]);
    // });

    // it('should return an error result when an error occurs', async () => {
    //   jest.spyOn(bebaBabyRepository, 'createQueryBuilder').mockRejectedValue(() => {
    //     throw new Error('test error');
    //   });

    //   const result = await service.lookupBabies('123');

    //   expect(result.isSuccess).toBe(false);
    // });
  });
});