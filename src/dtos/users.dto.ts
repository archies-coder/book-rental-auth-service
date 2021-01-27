import { Roles } from './../models/users.model'
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  public email: string

  @IsString()
  public password: string

  @IsString()
  public city: string

  @IsString()
  public gender: string

  @IsString()
  @IsOptional()
  public role: Roles

  @IsString()
  public phoneNumber: string

  @IsNumber()
  @IsOptional()
  public userId: number
}

export class LoginDto {
  @IsEmail()
  public email: string

  @IsString()
  public password: string
}
