import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import * as bcrypt from 'bcryptjs';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private userService: UserService) {}

  @Post('create')
  @Public()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    // Hash password from request body
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 12);
    
    const adminData = {
      fullName: 'Admin User',
      email: createAdminDto.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    };

    try {
      const admin = await this.userService['userModel'].create(adminData);
      return {
        success: true,
        message: 'Admin user created successfully',
        data: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Admin user already exists or error occurred',
        error: error.message
      };
    }
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: UserRole,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return {
        success: false,
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.',
      };
    }

    try {
      let result;
      
      if (role && Object.values(UserRole).includes(role)) {
        // Get users by specific role
        result = await this.userService.getUsersByRole(role, pageNum, limitNum);
      } else {
        // Get all users
        result = await this.userService.getAllUsers(pageNum, limitNum);
      }

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: result.users,
          pagination: {
            currentPage: pageNum,
            totalPages: result.totalPages,
            totalUsers: result.total,
            usersPerPage: limitNum,
            hasNextPage: pageNum < result.totalPages,
            hasPreviousPage: pageNum > 1,
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error retrieving users',
        error: error.message
      };
    }
  }

  @Get('users/stats')
  async getUserStats() {
    try {
      const [totalUsers, admins, customers, collaborators] = await Promise.all([
        this.userService['userModel'].countDocuments({}),
        this.userService['userModel'].countDocuments({ role: UserRole.ADMIN }),
        this.userService['userModel'].countDocuments({ role: UserRole.CUSTOMER }),
        this.userService['userModel'].countDocuments({ role: UserRole.COLLABORATOR }),
      ]);

      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: {
          totalUsers,
          usersByRole: {
            admins,
            customers,
            collaborators,
          },
          activeUsers: totalUsers, // For now, all users are considered active
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error retrieving user statistics',
        error: error.message
      };
    }
  }
}