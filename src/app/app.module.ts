// Libraries
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// Environment variables
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './pages/main/app.component';
import { SeguroComponent } from './pages/seguro/seguro.component';
import { TamplateComponent } from './pages/tamplate/tamplate.component';

@NgModule({
  declarations: [AppComponent, SeguroComponent, TamplateComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [TamplateComponent],
})
export class AppModule {}
