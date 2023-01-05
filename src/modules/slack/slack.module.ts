import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotionModule } from '@lib/notion';
import { SlackInteractiveService } from '@src/modules/slack/slack.interactive.service';
import { SlackEventService } from '@src/modules/slack/slack.event.service';
import { ConfigModule } from '@nestjs/config';
import { User } from '@src/modules/user/entities/user.entity';
import { OpenaiModule } from '@lib/openai';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    NotionModule.register({
      notionToken: process.env.NOTION_TOKEN,
      easterEggDataBaseId: process.env.EASTER_EGG_DB,
    }),
    OpenaiModule.register({
      secret_key: process.env.OPENAI_API_KEY,
      organization_id: process.env.OPENAI_ORGANIZATION_ID,
    }),
  ],
  controllers: [SlackController],
  providers: [SlackInteractiveService, SlackEventService],
  exports: [SlackEventService, SlackInteractiveService],
})
export class SlackModule {}
