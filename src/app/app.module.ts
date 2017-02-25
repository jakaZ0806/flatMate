import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material'
import { ApolloModule } from 'apollo-angular';

import { routing } from './shared/routes';
import { getClient } from './shared/apolloClient'

import { AuthGuard } from './auth-guard';
import { AuthenticationService} from './shared/services/authentication.service';
import { UserService} from './shared/services/user.service';

import { AppComponent } from './app.component';
import { BudgetComponent } from './budget/budget.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PlaygroundComponent } from './playground/playground.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    BudgetComponent,
    NavbarComponent,
    PlaygroundComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    routing,
    ApolloModule.forRoot(getClient)
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
