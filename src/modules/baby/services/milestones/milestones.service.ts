import { Injectable } from '@nestjs/common';
import { MilestoneResponse, MilestoneTopic } from '../../../../dtos/milestone';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { getMilestonesWorksheets } from '../../../../_helper/getExcelDocument';
import { Worksheet } from 'exceljs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BebaPersonalMilestone } from '../../../../entities/personal-milestone.entity';
import { PersonalMilestone } from '../../../../dtos/personal-milestone';
import { toEntity } from '../../../../_helper/toEntity/toEntity';

@Injectable()
export class MilestonesService {
    constructor(@InjectRepository(BebaPersonalMilestone) private bebaPersonalMilestone: Repository<BebaPersonalMilestone>, private toEntity: toEntity) {
    }

    async getMilestonesData(): Promise<Result<MilestoneResponse[]>> {
        try {
            const worksheet = await getMilestonesWorksheets();

            var results = worksheet.map(x => this.getMilestoneTopics(x));

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting z score", e, codes.GetMilestonesError)
            return new Result(false);
        }
    }

    async addPersonalMilestone(entity: PersonalMilestone) {
        try {

            var payload = this.toEntity.create<BebaPersonalMilestone>(entity);

            console.log(payload);

            await this.bebaPersonalMilestone.save(payload);

            return {
                isSuccess: true
            }
        } catch (e) {
            console.error("Error adding personal", e, codes.MilestonesServiceAddPersonalMilestone)
            return new Result(false);
        }
    }

    async getPersonalMilestone(babyId: string): Promise<Result<PersonalMilestone[]>> {
        try {
            const personalMilestones = await this.bebaPersonalMilestone.find({ where: { BabyId: babyId } });
            var results = personalMilestones.map(x => this.toEntity.produce<PersonalMilestone>(x));
            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting personal", e, codes.MilestonesServiceAddPersonalMilestone)
            return new Result(false);
        }
    }

    private getMilestoneTopics(worksheet: Worksheet): MilestoneResponse {
        var topics: MilestoneTopic[] = [];
        const weeksArr = worksheet.getColumn("A").values;
        const topicsArr = worksheet.getColumn("B").values;
        const contentArr = worksheet.getColumn("C").values;

        for (let index = 3; index < weeksArr.length; index++) {
            if (!contentArr[index]) continue;
            topics.push({
                content: contentArr[index] as string,
                topic: topicsArr[index] as string,
                week: weeksArr[index] as number
            });
        }

        return {
            subject: worksheet.name,
            topics
        };
    }
}
