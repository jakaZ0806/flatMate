/**
 * Created by Lukas on 14-Nov-16.
 */
import { Routes, RouterModule } from '@angular/router/';

import { PlaygroundComponent } from '../playground/playground.component';
import { BudgetComponent } from '../budget/budget.component';

export const routes: Routes = [
  { path: 'playground', component: PlaygroundComponent },
  { path: 'budget', component: BudgetComponent },
  { path: '', redirectTo: '/playground', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
