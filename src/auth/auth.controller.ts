import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, //TODO: readonly
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDTO: CreateUserDto) {
    const user = await this.userService.addUser(createUserDTO);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  //Access the user profile
  //We used JwtGuard to authenticate the user
  //RolesGuard plus @Roles decorator to provide the appropriate authorization depending on the user’s roles
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('user')
  getProfile(@Request() req) {
    return req.user;
  }

  //Is used to access the admin dashboard (like the user role)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin')
  getDashboard(@Request() req) {
    return req.user;
  }
}
