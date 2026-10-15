import { HeaderService } from './../services/header.service';
import { BreadCrumb } from './../../models/common/bread-crumb';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageHeader } from 'src/app/models/common/page-header';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'sym-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChangePasswordComponent implements OnInit {
  currentPassword: string;
  newPassword: string;
  verifyPassword: string;
  isChangePasswordClicked: boolean;
  message: { isSuccess: boolean; text: string };
  constructor(public headerService: HeaderService, public loginService: LoginService) {
    this.getPageHeader();
    this.isChangePasswordClicked = false;
    this.message = undefined;
  }

  ngOnInit() {}

  private getPageHeader() {
    this.headerService.pageHeader = new PageHeader();
    this.headerService.pageHeader.title = 'changePassword';
  }

  onChangePaswword() {
    this.isChangePasswordClicked = true;
    if (
      this.verifyPassword == '' ||
      this.verifyPassword == null ||
      this.verifyPassword == undefined ||
      this.newPassword == '' ||
      this.newPassword == null ||
      this.newPassword == undefined ||
      this.currentPassword == '' ||
      this.currentPassword == null ||
      this.currentPassword == undefined
    ) {
      return;
    }
    this.loginService.changePassword(this.newPassword, this.verifyPassword, this.currentPassword).subscribe(
      (successResponse) => {
        this.isChangePasswordClicked = false;
        this.message = {
          isSuccess: successResponse['success'],
          text: successResponse['message'],
        };
        if (this.message.isSuccess) {
          setTimeout(() => {
            this.loginService.settingService.logoutUser();
          }, 1000);
        }
        this.verifyPassword = undefined;
        this.currentPassword = undefined;
        this.newPassword = undefined;
        console.log(successResponse);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
