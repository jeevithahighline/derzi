import { APP_INITIALIZER, Provider } from '@angular/core';
import { ConfigService } from '../app/core/services/config.service';

export function initConfig(configService: ConfigService) {
  return () => configService.loadConfig();
}

export const ConfigProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initConfig,
  deps: [ConfigService],
  multi: true,
};
