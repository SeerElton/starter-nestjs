import { Body, Controller, Param, Post, Put, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBabyGrowthRecordRequest } from '../../../../dtos/getBabyGrowthRecordRequest';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { BabyGrowthTrackerService } from '../../services/baby-growth-record/baby-growth-record.service';
import { Response } from 'express';
import { codes } from '../../../../codes';
import { BabyGrowthRecordRequest } from '../../../../dtos/babyGrowthRecordRequest';
import { BabyGrowthRecordResponse } from '../../../../dtos/babyGrowthRecordResponse';

@ApiTags('baby')
@Controller('baby/growth-record')
export class BabyGrowthRecordController {
    constructor(private BabyGrowthTrackerService: BabyGrowthTrackerService) { }

    @Post('/:id')
    @ApiTags('baby')
    @ApiOperation({ summary: 'Get baby growth chart data' })
    @ApiParam({ name: 'id', description: 'ID of baby to return records of', type: 'string' })
    @ApiBody({ description: 'Get baby growth chart data', type: GetBabyGrowthRecordRequest })
    @ApiResponse({ status: 200, description: 'Successful operation', type: BabyGrowthRecordResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getGrowthRecord(@Param('id') id: string, @Body() milestoneRequest: GetBabyGrowthRecordRequest, @Res() res: Response) {
        try {

            const results = await this.BabyGrowthTrackerService.getGrowthRecord(id, milestoneRequest);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error getting baby growth data",
                    type: 'error'
                });
            }
            else {
                res.status(200).json(results.value);
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get baby growth controller exception", e, codes.BabyGrowthRecordControllerGetGrowthRecord);
        }
    }

    @Put('/')
    @ApiTags('baby')
    @ApiOperation({ summary: 'Add a baby baby growth record' })
    @ApiBody({ description: 'Add a baby new growth record', type: BabyGrowthRecordRequest })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addGrowthRecord(@Body() records: BabyGrowthRecordRequest, @Res() res: Response) {
        try {
            const results = await this.BabyGrowthTrackerService.addGrowthRecord(records);

            if (!results.isSuccess) {

                res.status(500).json({
                    message: "Error adding baby growth record",
                    type: 'error'
                })
            } else {
                res.status(200).json({
                    message: "Baby growth record added successfully",
                    type: 'success'
                });
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Add baby growth record controller exception", e, codes.BabyGrowthRecordControllerAddGrowthRecord);
        }
    }
}
