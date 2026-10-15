import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from 'src/app/offline/offline.service';
import { LoginService } from 'src/app/system-common/services/login.service';
import data from 'src/assets/config/url-config.json';
@Component({
  selector: 'sym-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoginRedirectComponent implements OnInit {
  isOktaLogin!: boolean;
  @Output() resetPinVar = new EventEmitter<LoginService>();
  applicationModeOnline: any;
  constructor(public offlineService: OfflineService, public settingService: SettingService) {
    let url = data;
    let isOktaRequired = url[1]?.isOktaRequired;
    if (isOktaRequired) {
      this.isOktaLogin = true;
    } else {
      this.isOktaLogin = false;
    }
    if (this.settingService.getApplicationMode() === 'offline') {
      this.offlineService.networkStatus$.subscribe((status) => {
        this.settingService.isConnected = status;
      });
    }
  }
  async ngOnInit(): Promise<void> {
    if (this.settingService.getApplicationMode() === 'offline') {
      const isOfflineLogout = localStorage.getItem('offlineLogout') === 'true';
      if (isOfflineLogout) {
        localStorage.removeItem('offlineLogout');
      }
    }
  }
}
