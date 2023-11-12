import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../../../_helper/jwt/public.decorator';
import { codes } from '../../../../codes';
import { Response } from 'express';
import { MilestoneResponse } from '../../../../dtos/milestone';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { ImmunizationTimelineService } from '../../services/immunization-timeline/immunization-timeline.service';
import { ImmunizationTimelineResponse } from '../../../../dtos/immunizationTimeline';

@ApiTags('immunization-timeline')
@Controller('immunization-timeline')
export class ImmunizationTimelineController {

    constructor(private immunizationTimelineService: ImmunizationTimelineService) { }

    @Public()
    @Get('')
    @ApiOperation({ summary: 'Get Immunization Dates' })
    // @ApiParam({ name: 'gender', description: 'baby\'s gender', type: 'string' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ImmunizationTimelineResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getImmunizationTimelines(@Res() res: Response) {
        try {
            const results = await this.immunizationTimelineService.getImmunizationTimelines();

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching immunization timelines",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get Immunization controller exception", e, codes.ImmunizationTimelineControllerGetImmunizationTimelines);
        }
    }
}
