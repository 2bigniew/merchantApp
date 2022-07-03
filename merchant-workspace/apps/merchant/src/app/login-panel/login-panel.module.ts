import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPanelComponent } from './login-panel.component';

@NgModule({
  declarations: [
    LoginPanelComponent
  ],
  exports: [
    LoginPanelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LoginPanelModule { }
