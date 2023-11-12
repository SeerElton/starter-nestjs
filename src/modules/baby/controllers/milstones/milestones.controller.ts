import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { codes } from '../../../../codes';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { Response } from 'express';
import { MilestonesService } from '../../services/milestones/milestones.service';
import { MilestoneResponse } from '../../../../dtos/milestone';
import { Public } from '../../../../_helper/jwt/public.decorator';
import { PersonalMilestone } from '../../../../dtos/personal-milestone';

@ApiTags('milestones')
@Controller('milestones')
export class MilestonesController {

    constructor(private milestonesService: MilestonesService) { }

    @Public()
    @Get('')
    @ApiOperation({ summary: 'Get Baby Milestones' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: MilestoneResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMilestones(@Res() res: Response) {
        try {
            const results = await this.milestonesService.getMilestonesData();

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching baby milestones",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get Baby Milestones controller exception", e, codes.MilestonesControllerGetMilestones);
        }
    }

    @Public()
    @Post('personal-milestone')
    @ApiOperation({ summary: 'Add Personal Milestones' })
    @ApiBody({ description: 'add personal milestone', type: ToastrResponse })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addPersonalMilestone(@Body() personalMilestone: PersonalMilestone, @Res() res: Response) {
        try {
            const results = await this.milestonesService.addPersonalMilestone(personalMilestone);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching baby milestones",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send()
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Add Personal Milestones controller exception", e, codes.MilestonesControllerAddPersonalMilestone);
        }
    }

    @Public()
    @Get('personal-milestone/:babyId')
    @ApiParam({ name: 'babyId', description: 'baby id', type: 'string' })
    @ApiOperation({ summary: 'Get Baby Personal Milestones' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: PersonalMilestone, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getPersonalMilestones(@Param('babyId') babyId: string, @Res() res: Response) {
        try {
            const results = await this.milestonesService.getPersonalMilestone(babyId);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching baby personal milestones",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get Baby Personal Milestones controller exception", e, codes.MilestonesControllerGetPersonalMilestones);
        }
    }
}
