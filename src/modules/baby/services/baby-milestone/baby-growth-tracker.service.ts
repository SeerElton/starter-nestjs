import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { Result } from '../../../../dtos/results';
import { BebaBabyGrowthRecord } from '../../../../entities/baby-growth-record.entity';
import { codes } from '../../../../codes';
import { GetBabyGrowthRecordRequest } from '../../../../dtos/getBabyGrowthRecordRequest';
import * as moment from 'moment';
import { BabyGrowthRecordRequest } from '../../../../dtos/babyGrowthRecordRequest';
import { BabyGrowthRecordResponse } from '../../../../dtos/babyGrowthRecordResponse';

@Injectable()
export class BabyGrowthTrackerService {
    constructor(@InjectRepository(BebaBabyGrowthRecord) private BebaBabyGrowthRecord: Repository<BebaBabyGrowthRecord>, private toEntity: toEntity) { }

    async addGrowthRecord(date: Date, record: BabyGrowthRecordRequest): Promise<Result<null>> {
        try {

            const entity: BebaBabyGrowthRecord = {
                BabyId: record.babyId,
                Date: date,
                HeadCircumference: record.headCircumference,
                Height: record.height,
                Id: record.id,
                Weight: record.weight
            };

            await this.BebaBabyGrowthRecord.save(entity);
            return new Result(true)

        } catch (e) {
            console.error("Error adding a baby growth record", e, codes.AddBabyGrowthRecordException)
            return new Result(false);
        }
    }

    async getGrowthRecord(id: string, milestoneRequest: GetBabyGrowthRecordRequest): Promise<Result<BabyGrowthRecordResponse[]>> {
        try {
            const milestones = await this.BebaBabyGrowthRecord.find({
                where: {
                    BabyId: id,
                    Date: MoreThanOrEqual(moment(milestoneRequest.startdate).subtract(1, 'hour').toDate()),
                },
            });

            const results = milestones.map(x => this.toEntity.produce<BabyGrowthRecordResponse>(x))

            return {
                isSuccess: true,
                value: results
            }

        } catch (e) {
            console.error("Error getting a baby growth record", e, codes.GetBabyGrowthRecordException)
            return new Result(false);
        }
    }
}
