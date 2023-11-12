import { Injectable, Res } from '@nestjs/common';
import { getExcelSheet } from '../../../../_helper/getExcelWorksheetDocument';
import { Gender } from '../../../../enums/gender.enum';
import { Result } from '../../../../dtos/results';
import { ZScoreItem } from '../../../../dtos/zScore';
import { codes } from '../../../../codes';
import { environment } from '../../../../environment';

@Injectable()
export class ZScoreService {
    constructor() {
    }

    async getWeightZScoreData(gender: Gender): Promise<Result<ZScoreItem[]>> {
        try {
            const file = environment.excelTemplates.weightForAge;
            var sheet = gender == Gender.Male ? 'BOYs Weight-for-age Charts' : 'GIRLs Weight-for-age Charts';

            const colsMap: ZScoreColumns = new ZScoreColumns(
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
            );

            const results = await this.getZScoreChartData(file, sheet, colsMap);

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting z", e, codes.GetWeightScoreError)
            return new Result(false);
        }
    }

    async getHeightZScoreData(gender: Gender): Promise<Result<ZScoreItem[]>> {
        try {
            const file = environment.excelTemplates.heightForAge;
            var sheet = gender == Gender.Male ? 'BOYS WEIGHTS FOR AGE CHARTS' : 'GIRLS WEIGHTS FOR AGE CHARTS';

            const colsMap: ZScoreColumns = new ZScoreColumns(
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
            );

            const results = await this.getZScoreChartData(file, sheet, colsMap);

            console.log(results);

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting z", e, codes.GetHeightScoreError)
            return new Result(false);
        }
    }

    async getHeadForAgeZScoreData(gender: Gender): Promise<Result<ZScoreItem[]>> {
        try {
            const file = environment.excelTemplates.headForAge;
            var sheet = gender == Gender.Male ? 'HEAD_CIRCUMFERENCE-FOR-AGE_GIRL' : 'HEAD-CIRCUMFERENCE-FOR_AGE-BOYS';

            const colsMap: ZScoreColumns = new ZScoreColumns(
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
            );

            const results = await this.getZScoreChartData(file, sheet, colsMap);

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error getting z", e, codes.GetHeadZScoreError)
            return new Result(false);
        }
    }

    private async getZScoreChartData(file: string, sheet, columnsMap: ZScoreColumns) {

        const worksheet = await getExcelSheet(file, sheet);
        const monthsArr = worksheet.getColumn(columnsMap.monthCol).values;
        const redN3Arr = worksheet.getColumn(columnsMap.redN3Col).values;
        const amberN2Arr = worksheet.getColumn(columnsMap.amberN2Col).values;
        const greenArr = worksheet.getColumn(columnsMap.greenCol).values;
        const amberP2Arr = worksheet.getColumn(columnsMap.amberP2Col).values;
        const redP3Arr = worksheet.getColumn(columnsMap.redP3Col).values;

        const results: ZScoreItem[] = [];

        for (let index = 2; index < monthsArr.length; index++) {
            results.push({
                redN3: parseFloat(redN3Arr[index].toString()),
                amberN2: parseFloat(amberN2Arr[index].toString()),
                green: parseFloat(greenArr[index].toString()),
                amberP2: parseFloat(amberP2Arr[index].toString()),
                redP3: parseFloat(redP3Arr[index].toString()),
                month: parseFloat(monthsArr[index].toString())
            });
        }

        return results.sort((a, b) => a.month - b.month);;

    }
}

class ZScoreColumns {
    monthCol: string;
    redN3Col: string;
    amberN2Col: string;
    greenCol: string;
    amberP2Col: string;
    redP3Col: string;

    constructor(monthCol: string,
        redN3Col: string,
        amberN2Col: string,
        greenCol: string,
        amberP2Col: string,
        redP3Col: string) {
        this.monthCol = monthCol;
        this.redN3Col = redN3Col;
        this.amberN2Col = amberN2Col;
        this.greenCol = greenCol;
        this.amberP2Col = amberP2Col;
        this.redP3Col = redP3Col;
    }
}
