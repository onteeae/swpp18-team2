import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ChatComponent} from './components/chat/chat.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {JwtModule} from '@auth0/angular-jwt';
import {AppRoutingModule} from './app-routing.module';
import {tokenGetter} from './core/auth.service';
import {SignupModule} from './signup/signup.module';
import {SigninComponent} from './intro/signin/signin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    SideMenuComponent,
    NavbarComponent,
    SigninComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    CoreModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        authScheme: 'Token ',
        whitelistedDomains: ['localhost:8000']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
