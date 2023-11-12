import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShareBabyRequest } from '../../../../dtos/shareBabyRequest';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { BabyProfileService } from '../../services/baby-profile/baby-profile.service';
import { Response } from 'express';
import { codes } from '../../../../codes';
import { UserProfile } from '../../../../dtos/userProfile';
import jwt_decode from "jwt-decode";
import { SharedBabyItem } from '../../../../dtos/models';

@Controller('baby-profile-share')
@ApiTags('baby-profile-share')
export class BabyProfileShareController {

    constructor(private babyProfileService: BabyProfileService) { }

    @Post('/:babyId')
    @ApiBody({ description: "Share profile request body", type: ShareBabyRequest })
    @ApiOperation({ summary: 'Allows you to share a baby profile' })
    @ApiParam({ name: 'babyId', description: 'ID of the baby', type: 'integer' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async shareBabyProfile(@Param('babyId') babyId: string, @Body() shareRequest: ShareBabyRequest, @Res() res: Response) {
        try {
            const results = await this.babyProfileService.shareProfile(babyId, shareRequest);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error sharing baby profile",
                    type: 'error'
                });
            }

            else {
                res.status(200).json({
                    message: "Baby profile shared successfully",
                    type: 'success'
                });
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("share baby profile controller exception", e, codes.BabyProfileShareControllerShareBabyProfile);
        }
    }

    @Get(':babyId')
    @ApiOperation({ summary: 'Get a list of emails I shared a baby profile with' })
    // TODO: fix this
    // @ApiResponse({ status: 200, description: 'Successful operation', type: SharedBabyItem, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ToastrResponse })
    async lookupBabySharedProfiles(@Param('babyId') babyId: string, @Res() res: Response) {
        try {
            const results = await this.babyProfileService.lookupShared(babyId);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error getting shared profiles",
                    type: 'error'
                });
            }
            else {
                res.status(200).json(results.value);
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get shared baby profiles controller exception", e, codes.BabyProfileShareControllerLookupBabySharedProfiles);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Allows parent to unshare a profile' })
    @ApiParam({ name: 'id', description: 'ID of the profile', required: true, type: 'integer' })
    @ApiResponse({ status: 200, description: 'Successful operation' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async sharedBabyProfileDelete(@Param('id') id: string, @Res() res: Response) {
        try {
            const results = await this.babyProfileService.deleteSharedAccess(id);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error occurred, system admins have been notified",
                    type: 'error'
                })
            }

            else {
                res.status(200).json({
                    message: "You've unshared a profile",
                    type: 'success'
                });
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Remove shared profile controller exception", e, codes.BabyProfileShareControllerSharedBabyProfileDelete);
        }
    }
}