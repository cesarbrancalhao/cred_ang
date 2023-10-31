import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUsercontactComponent } from './add-usercontact/add-usercontact.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUsercontactComponent } from './edit-usercontact/edit-usercontact.component';
import { UsercontactComponent } from './usercontact/usercontact.component';

@NgModule({
  declarations: [
    AppComponent,
    AddUsercontactComponent,
    UsercontactComponent,
    DashboardComponent,
    EditUsercontactComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }