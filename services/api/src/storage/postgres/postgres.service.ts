import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';
import type { Env } from '../../config/env';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;

  constructor(private readonly config: ConfigService<Env, true>) {}

  onModuleInit() {
    // infer: true 表示自动推断返回值的类型, 这里会推断出 connectionString 的类型为 string
    const connectionString = this.config.get('POSTGRES_URL', { infer: true });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.pool = new Pool({
      connectionString,
      max: 10,
    });
  }

  async onModuleDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.pool?.end();
  }

  query<T extends QueryResultRow>(text: string, params?: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.pool.query<T>(text, params);
  }
}
