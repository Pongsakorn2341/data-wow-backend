import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: string, createCommentDto: CreateCommentDto) {
    const result = await this.prismaService.comment.create({
      data: {
        ...createCommentDto,
        created_by: userId,
      },
    });
    return result;
  }

  async findAll() {
    const comments = await this.prismaService.comment.findMany();
    return comments;
  }

  private async findOne(userId: string, commentId: string) {
    const result = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
        created_by: userId,
      },
    });
    if (!result) {
      throw new Error(`Comment is not found`);
    }
    return result;
  }

  async update(userId: string, id: string, updateCommentDto: UpdateCommentDto) {
    const commentData = await this.findOne(userId, id);
    const result = await this.prismaService.comment.update({
      where: {
        id: commentData.id,
      },
      data: {
        detail: updateCommentDto.detail,
      },
    });
    return result;
  }

  async remove(userId: string, id: string) {
    const commentData = await this.findOne(userId, id);
    const result = await this.prismaService.comment.delete({
      where: {
        id: commentData.id,
      },
    });
    return result;
  }
}
