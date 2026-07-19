import { Body, CanActivate, Controller, createParamDecorator, ExecutionContext, Injectable, Post, Get, HttpCode, UnauthorizedException, UseGuards } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';
import type { Request } from 'express';
import type { User } from './domain.js';
import { StoreService } from './store.service.js';

export class GuestAuthDto { @IsString() @Length(2, 40) displayName!: string; }
export class RefreshDto { @IsString() refreshToken!: string; }
export class GoogleAuthDto { @IsString() idToken!: string; }

type AuthRequest = Request & { user?: User };
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => (context.switchToHttp().getRequest<AuthRequest>()).user!);

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService, private readonly store: StoreService) {}
  issue(user: User) {
    const accessToken = this.jwt.sign({ sub: user.id, name: user.displayName }, { secret: this.accessSecret, expiresIn: '15m' });
    const refreshToken = this.jwt.sign({ sub: user.id, sid: randomUUID(), kind: 'refresh' }, { secret: this.refreshSecret, expiresIn: '30d' });
    this.store.refreshHashes.set(this.hash(refreshToken), { userId: user.id, expiresAt: Date.now() + 30 * 86_400_000 });
    return { accessToken, refreshToken, expiresIn: 900, user };
  }
  verifyAccess(token: string): User {
    try { const payload = this.jwt.verify<{ sub: string }>(token, { secret: this.accessSecret }); const user = this.store.users.get(payload.sub); if (!user) throw new Error(); return user; }
    catch { throw new UnauthorizedException('Invalid access token'); }
  }
  rotate(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sub: string; kind: string }>(refreshToken, { secret: this.refreshSecret });
      const hash = this.hash(refreshToken); const session = this.store.refreshHashes.get(hash);
      if (payload.kind !== 'refresh' || !session || session.expiresAt < Date.now()) throw new Error();
      this.store.refreshHashes.delete(hash); const user = this.store.users.get(payload.sub); if (!user) throw new Error(); return this.issue(user);
    } catch { throw new UnauthorizedException('Invalid refresh token'); }
  }
  revoke(refreshToken: string): void { this.store.refreshHashes.delete(this.hash(refreshToken)); }
  private hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
  private get accessSecret() { return process.env.JWT_ACCESS_SECRET ?? 'development-only-change-me-access-secret-32chars'; }
  private get refreshSecret() { return process.env.JWT_REFRESH_SECRET ?? 'development-only-change-me-refresh-secret-32chars'; }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>(); const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Bearer token required');
    request.user = this.auth.verifyAccess(header.slice(7)); return true;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly store: StoreService) {}
  @Post('guest') guest(@Body() dto: GuestAuthDto) { return this.auth.issue(this.store.createUser(dto.displayName)); }
  @Post('google') google(@Body() _dto: GoogleAuthDto) { throw new UnauthorizedException('Google sign-in requires GOOGLE_WEB_CLIENT_ID; use guest mode locally'); }
  @Post('refresh') refresh(@Body() dto: RefreshDto) { return this.auth.rotate(dto.refreshToken); }
  @Post('logout') @HttpCode(204) logout(@Body() dto: RefreshDto) { this.auth.revoke(dto.refreshToken); }
  @Get('me') @UseGuards(AuthGuard) me(@CurrentUser() user: User) { return user; }
}
