import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { environment } from '../../environment';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        return true;

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            response.status(401).json({ message: 'Oppps, it seems you are not authenticated', type: 'error' }); // Send unauthorized response
            return false;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: environment.jwtConstants.secret,
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch {
            response.status(401).json({ message: 'Oppps, it seems you are not authenticated', type: 'error' }); // Send unauthorized response
            return false;
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}