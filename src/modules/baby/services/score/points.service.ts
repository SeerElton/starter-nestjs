import { Injectable } from '@nestjs/common';
import { BebaPersonalMilestone } from '../../../../entities/personal-milestone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { codes } from '../../../../codes';
import { Result } from '../../../../dtos/results';
import { BebaBabyGrowthRecord } from '../../../../entities/baby-growth-record.entity';
import { BebaBabyAdditionalInformation } from '../../../../entities/additional-information.entity';
import { BabyPointsResponse } from '../../../../dtos/babyPointsResponse';

@Injectable()
export class PointsService {
    constructor(@InjectRepository(BebaBabyAdditionalInformation) private bebaBabyAdditionalInformation: Repository<BebaBabyAdditionalInformation>, @InjectRepository(BebaPersonalMilestone) private bebaPersonalMilestone: Repository<BebaPersonalMilestone>, @InjectRepository(BebaBabyGrowthRecord) private bebaBabyGrowthRecord: Repository<BebaBabyGrowthRecord>) {

    }

    async getProfilePoints(id: string): Promise<Result<BabyPointsResponse>> {
        try {
            const records = await this.bebaBabyGrowthRecord.find({ where: { Id: id }, select: { Date: true } });
            const milestones = await this.bebaPersonalMilestone.count({ where: { IsUseful: true, BabyId: id } });
            const additionalInfo = await this.bebaBabyAdditionalInformation.exist({ where: { Id: id } });

            const recordsCount = [...new Set(records.map(x => moment(x.Date).format('YYYY/MM')))].length

            const results: BabyPointsResponse = {
                points: (recordsCount + (additionalInfo ? 10 : 0) + milestones) * 100,
                babyId: id
            }
            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting profile", e, codes.GetBabyPointsException)
            return new Result(false);
        }
    }
}
