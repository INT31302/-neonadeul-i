import { DynamicModule, Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NotionConfig } from '@lib/notion/notion.config';

@Module({})
export class NotionModule {
  static register({ notionToken, easterEggDataBaseId, motivationSuggestDataBaseId }: NotionConfig): DynamicModule {
    if (!notionToken) throw new Error('notionToken은 필수값입니다.');
    if (!easterEggDataBaseId) throw new Error('easterEggDataBaseId는 필수값입니다.');
    if (!motivationSuggestDataBaseId) throw new Error('motivationSuggestDataBaseId 필수값입니다.');

    const config = Object.assign(new NotionConfig(), { notionToken, easterEggDataBaseId, motivationSuggestDataBaseId });
    return {
      module: NotionModule,
      providers: [
        {
          provide: NotionConfig,
          useValue: config,
        },
        NotionService,
      ],
      exports: [NotionService],
    };
  }
}
