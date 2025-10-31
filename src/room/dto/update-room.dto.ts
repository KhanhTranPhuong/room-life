import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
  IsDateString,
  IsEmail,
  Min,
  Max,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { RoomStatus, RoomType } from '../schemas/room.schema';

class UpdateUtilitiesDto {
  @IsOptional()
  @IsNumber({}, { message: 'Electricity price must be a number' })
  @Min(0, { message: 'Electricity price must be positive' })
  electricity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Water price must be a number' })
  @Min(0, { message: 'Water price must be positive' })
  water?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Internet price must be a number' })
  @Min(0, { message: 'Internet price must be positive' })
  internet?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Cleaning price must be a number' })
  @Min(0, { message: 'Cleaning price must be positive' })
  cleaning?: number;
}

class UpdateAddressDto {
  @IsOptional()
  @IsString({ message: 'Street must be a string' })
  street?: string;

  @IsOptional()
  @IsString({ message: 'Ward must be a string' })
  ward?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;
}

class UpdateContactDto {
  @IsOptional()
  @IsString({ message: 'Contact name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a valid URL string' })
  images?: string[];

  @IsOptional()
  @IsEnum(RoomStatus, { message: 'Invalid room status' })
  status?: RoomStatus;

  @IsOptional()
  @IsEnum(RoomType, { message: 'Invalid room type' })
  roomType?: RoomType;

  @IsOptional()
  @IsNumber({}, { message: 'Area must be a number' })
  @Min(1, { message: 'Area must be at least 1 m²' })
  @Max(500, { message: 'Area must not exceed 500 m²' })
  area?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Price per month must be a number' })
  @Min(100000, { message: 'Price per month must be at least 100,000 VND' })
  pricePerMonth?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Deposit must be a number' })
  @Min(0, { message: 'Deposit must be positive' })
  deposit?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Max occupants must be a number' })
  @Min(1, { message: 'Max occupants must be at least 1' })
  @Max(10, { message: 'Max occupants must not exceed 10' })
  maxOccupants?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Available from must be a valid date' })
  availableFrom?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Floor must be a number' })
  @Min(0, { message: 'Floor must be 0 or higher' })
  @Max(50, { message: 'Floor must not exceed 50' })
  floor?: number;

  @IsOptional()
  @IsArray({ message: 'Amenities must be an array' })
  @IsString({ each: true, message: 'Each amenity must be a string' })
  amenities?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUtilitiesDto)
  utilities?: UpdateUtilitiesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContactDto)
  contact?: UpdateContactDto;
}