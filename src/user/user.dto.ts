import { ArrayMaxSize, ArrayMinSize, IsEmail } from 'class-validator';

export class UserDTO {
  @IsEmail()
  email: string;

  @ArrayMinSize(3)
  @ArrayMaxSize(20)
  password: string;
}
