import { Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';
import { UserModule } from './user/user.module';
import { HealthModule } from 'src/modules/health/health.module';

export const routes: Routes = [
  { path: '/auth', module: AuthModule },
  { path: '/notes', module: NoteModule },
  { path: '/users', module: UserModule },
  { path: '/health', module: HealthModule },
];
