/**
 * Created by Lukas on 14-Nov-16.
 */
import { Routes, RouterModule } from '@angular/router/';

import { PlaygroundComponent } from '../playground/playground.component';
import { BudgetComponent } from '../budget/budget.component';
import { LoginComponent } from "../login/login.component";
import {AuthGuard} from "../auth-guard";


export const routes: Routes = [
  { path: 'playground', component: PlaygroundComponent, canActivate: [AuthGuard] },
  { path: 'budget', component: BudgetComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/playground', pathMatch: 'full'},
  {
    path: 'crisis-center',
    component: PlaygroundComponent,
    children: [
      {
        path: '',
        component: PlaygroundComponent,
        children: [
          {
            path: ':id',
            component: PlaygroundComponent,
          },
          {
            path: '',
            component: PlaygroundComponent
          }
        ]
      }
    ]
  },
  {path: '**', redirectTo: ''  }
];

export const routing = RouterModule.forRoot(routes);
