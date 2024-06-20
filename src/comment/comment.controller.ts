import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CurrentUser,
  IUserJwt,
} from 'src/common/decorators/current-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @CurrentUser() userData: IUserJwt,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(userData.id, createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() userData: IUserJwt,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(userData.id, id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userData: IUserJwt) {
    return this.commentService.remove(userData.id, id);
  }
}
