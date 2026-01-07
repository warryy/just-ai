import { Injectable } from '@nestjs/common';
import type { QueryResult } from 'pg';
import { PostgresService } from '../postgres/postgres.service';
import type { CreateDocumentDto } from './documents.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly pg: PostgresService) {}

  async create(input: CreateDocumentDto): Promise<CreateDocumentDto | null> {
    const { tenant_id, title, source, content } = input;
    const res = (await this.pg.query<CreateDocumentDto>(
      `insert into documents(tenant_id, title, source, content)
       values ($1, $2, $3, $4)
       returning id, tenant_id, title, source, created_at`,
      [tenant_id, title, source, content],
    )) as QueryResult<CreateDocumentDto>;
    return res.rows[0];
  }

  async getById(id: number): Promise<CreateDocumentDto | null> {
    const res = (await this.pg.query<CreateDocumentDto>(
      `select id, tenant_id, title, source, content, created_at
       from documents where id = $1`,
      [id],
    )) as QueryResult<CreateDocumentDto>;
    return res.rows[0];
  }
}
