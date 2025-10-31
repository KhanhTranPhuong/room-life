import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/schemas/user.schema';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    const room = await this.roomService.create(createRoomDto, req.user.userId);
    return {
      success: true,
      message: 'Room created successfully',
      data: room,
    };
  }

  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    const result = await this.roomService.findAll(pageNum, limitNum);
    return {
      success: true,
      message: 'Rooms retrieved successfully',
      data: result,
    };
  }

  @Get('search')
  async search(@Query() filters: any) {
    const rooms = await this.roomService.search(filters);
    return {
      success: true,
      message: 'Search results retrieved successfully',
      data: rooms,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const room = await this.roomService.findOne(id);
    return {
      success: true,
      message: 'Room retrieved successfully',
      data: room,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COLLABORATOR)
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto, @Request() req) {
    const room = await this.roomService.update(id, updateRoomDto, req.user.userId, req.user.role);
    return {
      success: true,
      message: 'Room updated successfully',
      data: room,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    return await this.roomService.remove(id, req.user.userId, req.user.role);
  }
}