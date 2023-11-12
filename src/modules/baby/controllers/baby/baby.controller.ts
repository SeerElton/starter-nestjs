import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BabyProfileResponse } from '../../../../dtos/babyProfileResponse';
import { BabyRequest } from '../../../../dtos/babyRequest';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { BabyInfoService } from '../../services/baby-info/baby-info.service';
import jwt_decode from "jwt-decode";
import { UserProfile } from '../../../../dtos/userProfile';
import { Response } from 'express';
import { codes } from '../../../../codes';
import { PointsService } from '../../services/score/points.service';
import { BabyPointsResponse } from '../../../../dtos/babyPointsResponse';

@ApiTags('baby')
@Controller('baby')
export class BabyController {
    constructor(private babyInfoService: BabyInfoService, private pointsService: PointsService) { }

    @Put('add')
    @ApiOperation({ summary: 'Register a new baby' })
    @ApiBody({ description: 'add baby', type: BabyRequest })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addBaby(@Body() babyRequest: BabyRequest, @Req() req, @Res() res: Response) {
        try {
            var token = req.headers.authorization;
            var tokenData: UserProfile = jwt_decode(token);

            babyRequest.UserId = tokenData.Id;

            var result = await this.babyInfoService.addBaby(babyRequest);

            if (!result.isSuccess) {
                res.status(500).json({
                    message: "Error adding a baby",
                    type: 'error'
                });
            } else {
                res.status(200).json({
                    message: `${babyRequest.name}'s profile saved`,
                    type: 'success'
                })
            }

        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Add baby controller exception", e, codes.BabyControllerAddBaby);
        }
    }

    @Get('profile/:id')
    @ApiOperation({ summary: 'Get baby profile' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: BabyProfileResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getBabyProfile(@Param('id') id: string, @Res() res: Response) {
        try {
            //TODO: check for permission
            var result = await this.babyInfoService.getProfile(id);

            if (!result.isSuccess) {
                res.status(500).json({
                    message: "Error getting baby information, please try again later",
                    type: 'error'
                });
            }
            else {
                res.status(200).json(result.value);
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get baby profile controller exception", e, codes.BabyControllerGetBabyProfile)
        }
    }

    @Get('points/:id')
    @ApiOperation({ summary: 'Get baby rewards points' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: BabyPointsResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getBabyRewardPoints(@Param('id') id: string, @Res() res: Response) {
        try {

            //TODO: check for permission
            var result = await this.pointsService.getProfilePoints(id);

            if (!result.isSuccess) {
                res.status(500).json({
                    message: "Error getting baby's rewards points, please try again later",
                    type: 'error'
                });
            }
            else {
                res.status(200).json(result.value);
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("Get baby rewards point controller exception", e, codes.BabyControllerGetBabyRewardPoints)
        }
    }

    @Get('lookup')
    @ApiOperation({ summary: 'Get a list of all your babies' })
    // @ApiBody({ description: 'add baby', type: BabyLookupItem, isArray: true })
    @ApiResponse({ status: 200, description: 'Successful operation', type: BabyProfileResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async lookup(@Req() req, @Res() res: Response) {
        try {

            var token = req.headers.authorization;
            var tokenData = (jwt_decode<UserProfile>(token));

            var result = await this.babyInfoService.lookupBabies(tokenData.Id, tokenData.Email);

            if (!result.isSuccess) {
                res.status(500).json({
                    message: "Error getting baby information, please try again later",
                    type: 'error'
                });
            }
            else {
                res.status(200).json(result.value);
            }
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', type: 'error' });
            console.error("baby lookup controller exception", e, codes.BabyControllerLookup)
        }
    }
}
