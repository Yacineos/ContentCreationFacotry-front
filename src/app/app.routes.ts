import { Routes } from '@angular/router';
import { UrlInput } from './views/url-input/url-input';

export const routes: Routes = [
    {
        path: '',
        component: UrlInput,
        pathMatch: 'full'
    },
];
