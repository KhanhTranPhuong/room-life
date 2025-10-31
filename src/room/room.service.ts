import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UserRole } from '../user/schemas/user.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto, ownerId: string): Promise<Room> {
    const room = new this.roomModel({
      ...createRoomDto,
      ownerId: new Types.ObjectId(ownerId),
    });
    return room.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    rooms: Room[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [rooms, total] = await Promise.all([
      this.roomModel
        .find()
        .populate('ownerId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.roomModel.countDocuments().exec(),
    ]);

    return {
      rooms,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Room> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid room ID');
    }

    const room = await this.roomModel
      .findById(id)
      .populate('ownerId', 'fullName email')
      .exec();
    
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string, userRole: string): Promise<Room> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid room ID');
    }

    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Only admin or room owner can update
    if (userRole !== UserRole.ADMIN && room.ownerId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this room');
    }

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .populate('ownerId', 'fullName email')
      .exec();

    return updatedRoom;
  }

  async remove(id: string, userId: string, userRole: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid room ID');
    }

    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Only admin or room owner can delete
    if (userRole !== UserRole.ADMIN && room.ownerId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this room');
    }

    await this.roomModel.findByIdAndDelete(id).exec();
    
    return {
      success: true,
      message: 'Room deleted successfully',
    };
  }

  // Search rooms with filters
  async search(filters: any): Promise<Room[]> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.roomType) query.roomType = filters.roomType;
    if (filters.minPrice) query.pricePerMonth = { $gte: filters.minPrice };
    if (filters.maxPrice) {
      query.pricePerMonth = query.pricePerMonth || {};
      query.pricePerMonth.$lte = filters.maxPrice;
    }
    if (filters.city) query['address.city'] = new RegExp(filters.city, 'i');
    if (filters.minArea) query.area = { $gte: filters.minArea };
    if (filters.maxArea) {
      query.area = query.area || {};
      query.area.$lte = filters.maxArea;
    }

    return this.roomModel
      .find(query)
      .populate('ownerId', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }
}