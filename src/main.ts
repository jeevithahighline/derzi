import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // 👈 required
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideToastr } from 'ngx-toastr';

import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig, // keep your existing config
  providers: [
    ...(appConfig.providers || []), // merge existing providers
    provideCharts(withDefaultRegisterables()), // ✅ charts
    provideAnimations(), // ✅ required for toastr
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
  ],
}).catch((err) => console.error(err));

  
