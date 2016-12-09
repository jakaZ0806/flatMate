/**
 * Created by Lukas on 14-Nov-16.
 */
import { Routes, RouterModule } from '@angular/router/';

import { PlaygroundComponent } from '../playground/playground.component';
import { BudgetComponent } from '../budget/budget.component';

export const routes: Routes = [
  { path: 'playground', component: PlaygroundComponent },
  { path: 'budget', component: BudgetComponent },
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
  }
];

export const routing = RouterModule.forRoot(routes);
