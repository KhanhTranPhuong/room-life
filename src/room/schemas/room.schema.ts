import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  SHARED = 'shared',
  STUDIO = 'studio',
  APARTMENT = 'apartment',
}

@Schema()
export class Utilities {
  @Prop({ required: true })
  electricity: number; // VND per kWh

  @Prop({ required: true })
  water: number; // VND per m³

  @Prop({ default: 0 })
  internet: number; // VND per month

  @Prop({ default: 0 })
  cleaning: number; // VND per month
}

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  ward: string;

  @Prop({ required: true })
  city: string;
}

@Schema()
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @Prop({ type: String, enum: RoomType, required: true })
  roomType: RoomType;

  @Prop({ required: true })
  area: number; // m²

  @Prop({ required: true })
  pricePerMonth: number; // VND

  @Prop({ required: true })
  deposit: number; // VND

  @Prop({ required: true, min: 1 })
  maxOccupants: number;

  @Prop({ required: true })
  availableFrom: Date;

  @Prop({ required: true })
  floor: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: Utilities, required: true })
  utilities: Utilities;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: Contact, required: true })
  contact: Contact;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;
}

export const RoomSchema = SchemaFactory.createForClass(Room);