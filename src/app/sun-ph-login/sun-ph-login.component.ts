import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoginComponent } from '../system-common/login/login.component';
import { SettingService } from '../system-common/services/setting.service';
import { AuthService } from '../auth.service';
import { LoginService } from '../system-common/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CommonLoginService } from './service/common-login.service';
import { IdleTimerService } from '../idle-timeout.service';
import { OfflineService } from '../offline/offline.service';
import data from 'src/assets/config/url-config.json';

@Component({
  selector: 'sym-sun-ph-login',
  templateUrl: './sun-ph-login.component.html',
  styleUrls: ['./sun-ph-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SunPhLoginComponent extends LoginComponent implements OnInit {
  showPassword = false;
  proposalVersion: any;
  company: any;
  companySUNPH: any;
  public appVersion: any;
  public dbVersion: any;
  constructor(
    public settingService: SettingService,
    public authService: AuthService,
    protected loginService: LoginService,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public commonService: CommonLoginService,
    protected offlineService: OfflineService,
    protected idleTimerService: IdleTimerService
  ) {
    super(
      settingService,
      authService,
      loginService,
      router,
      formBuilder,
      activatedRoute,
      offlineService,
      idleTimerService
    );
    this.getCompanyName();
    this.getPropMatrix();
    const url: any = (data as any).default ?? data;
    this.companySUNPH = url[1]?.companySUNPH;
  }
  getPropMatrix() {
    this.loginService.getProposalVersion().subscribe((lookupList): any => {
      console.log('Languages: ' + JSON.stringify(lookupList['data'].proposalVersion));
      this.useCaseList = JSON.parse(JSON.stringify(lookupList['data']['proposalVersion']));
      this.proposalVersion = this.useCaseList[0]['cd'];
      if (this.settingService.getApplicationMode() === 'offline') {
        this.appVersion = JSON.parse(JSON.stringify(lookupList['data']['appVersion']));
        this.dbVersion = JSON.parse(JSON.stringify(lookupList['data']['dbVersion']));
      }
    });
  }

  getCompanyName() {
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngAfterViewInit(): void {
    console.log(this.settingService.getApplicationMode());
  }
}
