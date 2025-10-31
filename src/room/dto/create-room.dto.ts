import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  Min,
  Max,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { RoomStatus, RoomType } from '../schemas/room.schema';

class CreateUtilitiesDto {
  @IsNumber({}, { message: 'Electricity price must be a number' })
  @Min(0, { message: 'Electricity price must be positive' })
  electricity: number;

  @IsNumber({}, { message: 'Water price must be a number' })
  @Min(0, { message: 'Water price must be positive' })
  water: number;

  @IsOptional()
  @IsNumber({}, { message: 'Internet price must be a number' })
  @Min(0, { message: 'Internet price must be positive' })
  internet?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Cleaning price must be a number' })
  @Min(0, { message: 'Cleaning price must be positive' })
  cleaning?: number;
}

class CreateAddressDto {
  @IsNotEmpty({ message: 'Street is required' })
  @IsString({ message: 'Street must be a string' })
  street: string;

  @IsNotEmpty({ message: 'Ward is required' })
  @IsString({ message: 'Ward must be a string' })
  ward: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city: string;
}

class CreateContactDto {
  @IsNotEmpty({ message: 'Contact name is required' })
  @IsString({ message: 'Contact name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phone: string;

  @IsNotEmpty({ message: 'Contact email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a valid URL string' })
  images?: string[];

  @IsOptional()
  @IsEnum(RoomStatus, { message: 'Invalid room status' })
  status?: RoomStatus;

  @IsNotEmpty({ message: 'Room type is required' })
  @IsEnum(RoomType, { message: 'Invalid room type' })
  roomType: RoomType;

  @IsNotEmpty({ message: 'Area is required' })
  @IsNumber({}, { message: 'Area must be a number' })
  @Min(1, { message: 'Area must be at least 1 m²' })
  @Max(500, { message: 'Area must not exceed 500 m²' })
  area: number;

  @IsNotEmpty({ message: 'Price per month is required' })
  @IsNumber({}, { message: 'Price per month must be a number' })
  @Min(100000, { message: 'Price per month must be at least 100,000 VND' })
  pricePerMonth: number;

  @IsNotEmpty({ message: 'Deposit is required' })
  @IsNumber({}, { message: 'Deposit must be a number' })
  @Min(0, { message: 'Deposit must be positive' })
  deposit: number;

  @IsNotEmpty({ message: 'Max occupants is required' })
  @IsNumber({}, { message: 'Max occupants must be a number' })
  @Min(1, { message: 'Max occupants must be at least 1' })
  @Max(10, { message: 'Max occupants must not exceed 10' })
  maxOccupants: number;

  @IsNotEmpty({ message: 'Available from date is required' })
  @IsDateString({}, { message: 'Available from must be a valid date' })
  availableFrom: string;

  @IsNotEmpty({ message: 'Floor is required' })
  @IsNumber({}, { message: 'Floor must be a number' })
  @Min(0, { message: 'Floor must be 0 or higher' })
  @Max(50, { message: 'Floor must not exceed 50' })
  floor: number;

  @IsOptional()
  @IsArray({ message: 'Amenities must be an array' })
  @IsString({ each: true, message: 'Each amenity must be a string' })
  amenities?: string[];

  @IsNotEmpty({ message: 'Utilities information is required' })
  @ValidateNested()
  @Type(() => CreateUtilitiesDto)
  utilities: CreateUtilitiesDto;

  @IsNotEmpty({ message: 'Address information is required' })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty({ message: 'Contact information is required' })
  @ValidateNested()
  @Type(() => CreateContactDto)
  contact: CreateContactDto;
}