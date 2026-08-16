import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { SessionGuard } from '../common/session.guard'
import { ChatMessageDto } from './chat-message.dto'
import { ChatService } from './chat.service'

@Controller('chat')
@UseGuards(SessionGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  send(@Body() body: ChatMessageDto) {
    return this.chatService.send(body.message)
  }
}
