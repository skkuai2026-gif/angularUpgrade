import { Component, Injector, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from './system-common/services/setting.service';
import { OfflineService } from './offline/offline.service';
// import * as data from '../assets/config/url-config.json';
import data from '../assets/config/url-config.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent implements OnInit {
  public company: any;
  public companySUNPH: any;
  public appReady: boolean = false;
  constructor(
    private settingService: SettingService,
    private offlineService: OfflineService,
    private router: Router,
    private injector: Injector
  ) {
    SettingService.setInjector(injector);
    const currentPath = window.location.pathname;
    const isOktaCallback = currentPath.includes('/login/callback');
    const isOfflineLogout = localStorage.getItem('offlineLogout') === 'true';
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      this.settingService.isRhosimulator !== true &&
      !isOktaCallback &&
      !isOfflineLogout
    ) {
      this.offlineService.showSplashScreen();
      this.offlineService.initializeApp();
    }

    const url = data;
    this.companySUNPH = url[1]?.companySUNPH;
    this.appReady = true;
  }
  ngOnInit() {}
  initializeApp() {}
}
