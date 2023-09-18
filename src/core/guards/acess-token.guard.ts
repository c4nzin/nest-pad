import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT } from 'src/features/auth/strategies';

@Injectable()
export class AccessTokenGuard extends AuthGuard(JWT) {}
