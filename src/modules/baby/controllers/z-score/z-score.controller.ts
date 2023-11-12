import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Gender } from '../../../../enums/gender.enum';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { ZScoreService } from '../../services/z-score/z-score.service';
import { ZScoreItem } from '../../../../dtos/zScore';
import { Response } from 'express';
import { codes } from '../../../../codes';

@ApiTags('z-score')
@Controller('z-score')
export class ZScoreController {

    constructor(private zScoreService: ZScoreService) { }

    @Get('weight-for-age/:gender')
    @ApiOperation({ summary: 'Get weight for age chart data' })
    @ApiParam({ name: 'gender', description: 'baby\'s gender', type: 'string' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ZScoreItem, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getWeightZScore(@Param('gender') gender: Gender, @Res() res: Response) {
        try {
            const results = await this.zScoreService.getWeightZScoreData(gender);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching weight for age chart",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get weight for age chat data controller exception", e, codes.ZScoreControllerGetZScore);
        }
    }

    @Get('height-for-age/:gender')
    @ApiOperation({ summary: 'Get height for age chat data ' })
    @ApiParam({ name: 'gender', description: 'baby\'s gender', type: 'string' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ZScoreItem, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getHeightZScore(@Param('gender') gender: Gender, @Res() res: Response) {
        try {
            const results = await this.zScoreService.getHeadForAgeZScoreData(gender);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching height for age chat data",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get height for age chat controller exception", e, codes.HeightForAgeChatData);
        }
    }

    @Get('head-circumference-for-age/:gender')
    @ApiOperation({ summary: 'Get head circumference for age chat data ' })
    @ApiParam({ name: 'gender', description: 'baby\'s gender', type: 'string' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ZScoreItem, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getHeadForAgeZScore(@Param('gender') gender: Gender, @Res() res: Response) {
        try {
            const results = await this.zScoreService.getHeadForAgeZScoreData(gender);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching head circumference for age chat data",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get head circumference for age chat controller exception", e, codes.HeadCircumferenceForAgeChatData);
        }
    }
}
