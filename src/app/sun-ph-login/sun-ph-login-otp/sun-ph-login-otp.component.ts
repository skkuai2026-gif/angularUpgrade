import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { first } from 'rxjs/operators';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LoginService } from 'src/app/system-common/services/login.service';
import { LoginOtpComponent } from 'src/app/system-common/login-otp/login-otp.component';
import { CommonLoginService } from '../service/common-login.service';

@Component({
  selector: 'sym-sun-ph-login-otp',
  templateUrl: './sun-ph-login-otp.component.html',
  styleUrls: ['./sun-ph-login-otp.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SunPhLoginOtpComponent extends LoginOtpComponent {
  urlguid: any;
  companyCode: string = '';

  constructor(
    public settingService: SettingService,
    public authService: AuthService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    public loginService: LoginService,
    public commonLoginService: CommonLoginService
  ) {
    super(settingService, authService, router, activatedRoute, loginService);
  }

  async ngOnInit() {
    const rawQuery = window.location.search.substring(1);
    const queryParts = rawQuery.split('&');

    const flagParam = queryParts.find((part) => {
      const [_, value] = part.split('=');
      return value === '';
    });

    if (flagParam) {
      const [companyCode] = flagParam.split('=');
      this.companyCode = companyCode;
    }
    this.activatedRoute.queryParams.subscribe((params) => {
      this.urlguid = params['guid'];
    });
    // this.getGuid();
    this.commonLoginService.validateRSToken(this.urlguid).subscribe((body) => {
      let tokenResponse: any = JSON.parse(JSON.stringify(body));
      console.log('tokenResponse', tokenResponse);
      if (tokenResponse.data['remoteSellingLinkExpired'] == false) {
        if (tokenResponse['success'] === true) {
          this.getGuid();
          super.ngOnInit();
        } else {
          console.log('tokenResponse failed');
          this.router.navigate(['policy-login-otp-redirect']);
        }
      } else {
        console.log('remoteSellingLinkExpired failed');
        this.router.navigate(['policy-login-otp-redirect']);
      }
    });
  }
}
