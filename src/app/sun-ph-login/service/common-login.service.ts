import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import { LoginService } from 'src/app/system-common/services/login.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Injectable({
  providedIn: 'root',
})
export class CommonLoginService extends LoginService {
  constructor(
    private router: Router,
    protected http: HttpClient,
    public settingService: SettingService,
    protected loginService: LoginService,
    public authService: AuthService,
    public baseService: BaseService
  ) {
    super(http, settingService);
  }

  public validateRSToken(guid) {
    let body = {
      guid: guid,
    };
    return this.httpPost(`/api/RSloginSUNPH/validateTokeRS`, body, undefined, false);
  }
}
