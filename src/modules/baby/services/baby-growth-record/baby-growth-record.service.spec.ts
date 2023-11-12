// TODO: uncomment and fix
// import { Test, TestingModule } from '@nestjs/testing';
// import { BabyGrowthTrackerService } from './baby-growth-tracker.service';
// import { BebaBabyGrowthRecord } from '../../../../entities/baby-growth-record.entity';
// import { Result } from '../../../../dtos/results';
// import { toEntity } from '../../../../_helper/toEntity/toEntity';
// import { Repository } from 'typeorm';
// import { GetBabyGrowthRecordRequest } from '../../../../dtos/getBabyGrowthRecordRequest';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { BabyGrowthRecordRequest } from '../../../../dtos/BabyGrowthRecordRequest';

// describe('BabyGrowthTrackerService', () => {
//   let service: BabyGrowthTrackerService;
//   let BebaBabyGrowthRecord: Repository<BebaBabyGrowthRecord>;
//   let toEntityService: toEntity;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         BabyGrowthTrackerService,
//         {
//           provide: getRepositoryToken(BebaBabyGrowthRecord),
//           useClass: Repository,
//         },
//         toEntity,
//       ],
//     }).compile();

//     service = module.get<BabyGrowthTrackerService>(BabyGrowthTrackerService);
//     toEntityService = module.get<toEntity>(toEntity);
//     BebaBabyGrowthRecord = module.get<Repository<BebaBabyGrowthRecord>>(
//       getRepositoryToken(BebaBabyGrowthRecord),
//     );
//   });

//   describe('addGrowthRecord', () => {
//     const mockDate = new Date();
//     const mockGrowthRecord: BabyGrowthRecordRequest = {
//       babyId: '123',
//       headCircumference: 12,
//       height: 34,
//       id: '456',
//       weight: 56,
//     };

//     it('should add a growth record and return a successful result', async () => {
//       jest.spyOn(BebaBabyGrowthRecord, 'save').mockResolvedValue(undefined);

//       const result = await service.addGrowthRecord(mockDate, mockGrowthRecord);

//       expect(BebaBabyGrowthRecord.save).toHaveBeenCalledWith({
//         BabyId: mockGrowthRecord.babyId,
//         Date: mockDate,
//         HeadCircumference: mockGrowthRecord.headCircumference,
//         Height: mockGrowthRecord.height,
//         Id: mockGrowthRecord.id,
//         Weight: mockGrowthRecord.weight,
//       });
//       expect(result).toEqual(new Result(true));
//     });

//     it('should handle errors and return a failed result', async () => {
//       jest.spyOn(BebaBabyGrowthRecord, 'save').mockRejectedValue(undefined);

//       const result = await service.addGrowthRecord(mockDate, mockGrowthRecord);

//       expect(BebaBabyGrowthRecord.save).toHaveBeenCalledWith({
//         BabyId: mockGrowthRecord.babyId,
//         Date: mockDate,
//         HeadCircumference: mockGrowthRecord.headCircumference,
//         Height: mockGrowthRecord.height,
//         Id: mockGrowthRecord.id,
//         Weight: mockGrowthRecord.weight,
//       });
//       expect(result).toEqual(new Result(false));
//     });
//   });

//   describe('getGrowthRecord', () => {
//     it('should return an empty array if no baby growth record found', async () => {
//       const id = 'test_id';
//       const milestoneRequest: GetBabyGrowthRecordRequest = {
//         startdate: new Date()
//       };
//       jest.spyOn(BebaBabyGrowthRecord, 'find').mockResolvedValue([]);

//       const result = await service.getGrowthRecord(id, milestoneRequest);

//       expect(result.isSuccess).toBe(true);
//       expect(result.value).toEqual([]);
//     });

//     it('should return an array of baby growth if found', async () => {
//       const id = 'test_id';
//       const milestoneRequest: GetBabyGrowthRecordRequest = {
//         startdate: new Date()
//       };

//       const records: BebaBabyGrowthRecord[] = [
//         {
//           BabyId: id,
//           Date: new Date(),
//           HeadCircumference: 1,
//           Height: 1,
//           Id: "123",
//           Weight: 1,
//         },
//         {
//           BabyId: id,
//           Date: new Date(),
//           HeadCircumference: 2,
//           Height: 2,
//           Id: "345",
//           Weight: 2,
//         },
//       ];
//       jest.spyOn(BebaBabyGrowthRecord, 'find').mockResolvedValue(records);

//       const expectedResults = records.map(x => toEntityService.produce(x))
//       const result = await service.getGrowthRecord(id, milestoneRequest);

//       expect(result.isSuccess).toBe(true);
//       expect(result.value).toEqual(expectedResults);
//     });

//     it('should return an error result when an error occurs', async () => {
//       const id = 'test_id';
//       const milestoneRequest: GetBabyGrowthRecordRequest = {
//         startdate: new Date(),
//       };
//       jest.spyOn(BebaBabyGrowthRecord, 'find').mockRejectedValue(undefined);

//       const result = await service.getGrowthRecord(id, milestoneRequest);

//       expect(result.isSuccess).toBe(false);
//     });
//   });
// });
