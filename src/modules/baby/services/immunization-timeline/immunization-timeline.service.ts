import { Injectable } from '@nestjs/common';
import { getImmunizationWorksheets } from '../../../../_helper/getExcelDocument';
import { codes } from '../../../../codes';
import { Result } from '../../../../dtos/results';
import { Worksheet } from 'exceljs';
import { MilestoneTopic } from '../../../../dtos/milestone';
import { ImmunizationTimelineResponse } from '../../../../dtos/immunizationTimeline';

@Injectable()
export class ImmunizationTimelineService {
    async getImmunizationTimelines() {
        try {
            const worksheet = await getImmunizationWorksheets();
            var results = this.compileImmunizationTimelines(worksheet);

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting z", e, codes.ImmunizationTimelineServiceGetImmunizationTimelines)
            return new Result(false);
        }
    }

    private compileImmunizationTimelines(worksheet: Worksheet): ImmunizationTimelineResponse[] {
        var timelines: ImmunizationTimelineResponse[] = [];
        const weeksArr = worksheet.getColumn("A").values;
        const ageArr = worksheet.getColumn("B").values;
        const vaccineArr = worksheet.getColumn("C").values;
        const vaccineDescriptionArr = worksheet.getColumn("D").values;
        const isGovernmentArr = worksheet.getColumn("E").values;
        const isOptionalArr = worksheet.getColumn("F").values;


        for (let index = 2; index < weeksArr.length; index++) {
            if (!weeksArr[index]) continue;
            timelines.push({
                age: ageArr[index] as string,
                vaccine: vaccineArr[index] as string,
                vaccineDescription: vaccineDescriptionArr[index] as string,
                week: weeksArr[index] as number,
                isGovernment: (isGovernmentArr[index] as string) == 'Yes' ? true : false,
                isOptional: (isOptionalArr[index] as string) == 'Yes' ? true : false,
            });
        }

        return timelines;
    }
}
