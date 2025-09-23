import { inject, Injectable } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { SearchMockApi } from 'app/mock-api/common/search/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
    authMockApi = inject(AuthService);
    iconsMockApi = inject(IconsMockApi);
    navigationMockApi = inject(NavigationMockApi);
    searchMockApi = inject(SearchMockApi);
}
