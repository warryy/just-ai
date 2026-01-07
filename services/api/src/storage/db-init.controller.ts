import { Controller, Post, Version } from '@nestjs/common';
import { PostgresService } from './postgres/postgres.service';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

@Controller()
export class DbInitController {
  constructor(private readonly pg: PostgresService) {}

  @Version('1')
  @Post('admin/db/init')
  async init() {
    const sqlPath = join(process.cwd(), 'src/storage/migrations/init.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    await this.pg.query(sql);
    return { ok: true };
  }
}
