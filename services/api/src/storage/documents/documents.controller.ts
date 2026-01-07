import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Version,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentSchema, CreateDocumentDto } from './documents.dto';

@Controller()
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Version('1')
  @Post('documents')
  async create(@Body() body: unknown): Promise<CreateDocumentDto> {
    const parsed = CreateDocumentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map((e) => e.path.join('.') + ': ' + e.message),
      );
    }
    const doc = await this.docs.create(parsed.data);
    if (!doc) {
      throw new InternalServerErrorException('Failed to create document');
    }
    return doc;
  }

  @Version('1')
  @Get('documents/:id')
  async get(
    @Param('id') id: string,
  ): Promise<{ found: boolean; document?: CreateDocumentDto }> {
    const doc = await this.docs.getById(parseInt(id));
    if (!doc) {
      if (!doc) return { found: false };
    }
    return { found: true, document: doc };
  }
}
