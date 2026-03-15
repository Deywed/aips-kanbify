import { Controller, Get } from '@nestjs/common';

import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';

@Controller('health')
export class HealthController {
  @Get()
  @Auth(AuthType.None)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
