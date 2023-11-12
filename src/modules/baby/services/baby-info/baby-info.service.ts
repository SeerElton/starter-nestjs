import { Injectable } from '@nestjs/common';
import { BebaBaby } from '../../../../entities/baby.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BabyRequest } from '../../../../dtos/babyRequest';
import { Result } from '../../../../dtos/results';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { codes } from '../../../../codes';
import { BabyProfileResponse, Permission } from '../../../../dtos/models';
import { BebaBabySharedProfile } from '../../../../entities/shared-profile.entity';
import { BebaBabyGrowthRecord } from '../../../../entities/baby-growth-record.entity';

@Injectable()
export class BabyInfoService {
    constructor(@InjectRepository(BebaBaby) private bebaBaby: Repository<BebaBaby>,
        @InjectRepository(BebaBabyGrowthRecord) private bebaBabyGrowthRecord: Repository<BebaBabyGrowthRecord>,
        @InjectRepository(BebaBabySharedProfile) private bebaBabySharedProfile: Repository<BebaBabySharedProfile>,
        private toEntity: toEntity) { }

    async addBaby(babyRequest: BabyRequest): Promise<Result<null>> {
        try {
            var entity = this.toEntity.create<BebaBaby>(babyRequest);

            await this.bebaBaby.save(entity);

            var bebaBabyGrowthRecord: BebaBabyGrowthRecord = {
                BabyId: entity.Id,
                Date: entity.DOB,
                HeadCircumference: entity.HeadCircumferenceAtBirth,
                Height: entity.HeightAtBirth,
                Weight: entity.WeightAtBirth,
                Id: entity.Id,
            }

            if (bebaBabyGrowthRecord.Height && bebaBabyGrowthRecord.Weight && bebaBabyGrowthRecord.HeadCircumference) {
                await this.bebaBabyGrowthRecord.save(bebaBabyGrowthRecord);
            }
            return new Result(true)

        } catch (e) {
            console.error("Error adding baby", e, codes.AddBabyException)
            return new Result(false);
        }
    }

    async getProfile(id: string): Promise<Result<BabyProfileResponse>> {
        try {

            var entity = await this.bebaBaby.findOneBy({ Id: id });

            if (!entity) {
                return new Result(false);
            }

            var results = this.toEntity.produce<BabyProfileResponse>(entity);

            return {
                isSuccess: true,
                value: results
            }

        } catch (e) {
            console.error("Error getting profile", e, codes.GetProfileException)
            return new Result(false);
        }
    }

    async lookupBabies(Id: string, email: string): Promise<Result<BabyProfileResponse[]>> {
        try {
            var shared = await this.bebaBabySharedProfile.find({ where: { Email: email } });
            var yours = await this.bebaBaby.find({
                where:
                    [
                        { UserId: Id },
                        { Id: In(shared.map(x => x.BabyId)) }
                    ]
            });

            var results: BabyProfileResponse[] = yours.map(x => ({
                permission: shared.find(y => y.BabyId == x.Id)?.Permission ?? Permission.READWRITE,
                DOB: x.DOB,
                gender: x.Gender,
                id: x.Id,
                name: x.Name,
                picture: x.Picture,
                relationshipWithUser: x.RelationshipWithUser
            }));

            return {
                isSuccess: true,
                value: results
            }

        } catch (e) {
            console.error("Error getting lookup", e, codes.LookupBabiesException)
            return new Result(false);
        }
    }
}

