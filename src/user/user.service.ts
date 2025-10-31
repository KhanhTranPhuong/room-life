import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, email, password, confirmPassword } = createUserDto;

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Additional email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check for common invalid email domains
    const invalidDomains = ['tempmail', 'guerrillamail', '10minutemail'];
    const emailDomain = normalizedEmail.split('@')[1];
    if (invalidDomains.some(domain => emailDomain.includes(domain))) {
      throw new BadRequestException('Please use a valid email address');
    }

    // Check if user already exists (case-insensitive)
    const existingUser = await this.userModel.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Validate full name format
    const trimmedFullName = fullName.trim();
    if (trimmedFullName.length < 2) {
      throw new BadRequestException('Full name must be at least 2 characters long');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with default role as customer
    const user = new this.userModel({
      fullName: trimmedFullName,
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel
        .find({})
        .select('-password') // Exclude password from results
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments({}).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      totalPages
    };
  }

  async getUsersByRole(role: UserRole, page: number = 1, limit: number = 10): Promise<{ users: User[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel
        .find({ role })
        .select('-password') // Exclude password from results
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments({ role }).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      totalPages
    };
  }
}