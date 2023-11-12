import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Public } from '../_helper/jwt/public.decorator';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs'
import * as path from 'path';

@Public()
@Controller('')
@ApiTags('root')
export class RootController {

    @Public()
    @ApiTags('root')
    @ApiOperation({ summary: 'Ping' })
    @Get('ping')
    ping() {
        return 'pong';
    }

    @Public()
    @ApiTags('root')
    @Get('public/:folder/:imgpath')
    @ApiOperation({ summary: 'get image' })
    @ApiParam({ name: 'folder', description: 'folder', type: 'string' })
    @ApiParam({ name: 'imgpath', description: 'imgpath', type: 'string' })
    seeUploadedFile(@Param('folder') folder, @Param('imgpath') image, @Res() res) {
        return res.sendFile(`${folder}/${image}`, { root: './public' });
    }

    @Public()
    @ApiOperation({ summary: 'Get baby avatars' })
    @ApiTags('root')
    @Get('avatars')
    async getAvatar(@Res() res, @Req() req) {
        try {
            const host = req.get('host');
            console.log(host);

            const avatarFolderPath = path.join(__dirname, '..', '..', 'public', 'avatars');
            console.log(avatarFolderPath);
            const files = await fs.promises.readdir(avatarFolderPath);

            res.send(files.filter(x => x.includes('.png')).map(x => `http://${host}/public/avatars/${x}`));
        } catch (err) {
            console.error(err);
            res.status(500).send({ type: 'error', message: 'Internal Server Error' });
        }
    }
}
