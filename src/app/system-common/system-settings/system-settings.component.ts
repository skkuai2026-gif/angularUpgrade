import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumb } from './../../models/common/bread-crumb';
import { HeaderService } from './../services/header.service';
import { SettingService } from '../../system-common/services/setting.service';
import { PageHeader } from 'src/app/models/common/page-header';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { BaseService } from '../services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {} './system-settings.component.cs'
@Component({
  selector: 'sym-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SystemSettingsComponent extends BaseComponent<BaseService> implements OnInit {
  public breadCrumbList: BreadCrumb[];
  public currentSelectedTheme: string;
  public selectedTheme: string;
  public baseURL;
  public enableFingerprintAuth: boolean = false;
  constructor(
    baseService: BaseService,
    public settingService: SettingService,
    public headerService: HeaderService,
    private http: HttpClient
  ) {
    super(baseService);
    this.currentSelectedTheme = this.settingService.getSessionStorageValue('currentSelectedTheme');
    this.getPageHeader();
  }

  public themeList = {
    data: {
      themeList: [
        { cd: 'default', desc: 'Default' },
        { cd: 'light', desc: 'Light' },
        { cd: 'dark', desc: 'Dark' },
        { cd: 'metallic', desc: 'Metallic' },
        { cd: 'green', desc: 'Green' },
      ],
    },
  };
  ngOnInit() {
    super.ngOnInit();
    this.breadCrumbList = [];
    this.breadCrumbList = this.getBreadCrumbList();
    if (this.settingService.getApplicationMode() === 'offline') {
      const userCredentials = this.settingService.getURLValue('USERCREDENTIALS');
      if (userCredentials != undefined) {
        this.enableFingerprintAuth = userCredentials['enableFingerprintAuth'] === 'YES';
      }
    }
  }

  onSettingThemeSelect(themeName: string) {
    if (this.currentSelectedTheme != undefined) this.settingService.removeExternalStyle(this.currentSelectedTheme);

    let cssFileName = themeName + '.css';
    if (themeName != 'default') this.settingService.loadExternalStyle(cssFileName, 'assets/theme/css/skin');

    //Setting this variable temporarily only for metallic since some code changes also exist.
    //TODO this needs to be removed

    if (themeName == 'metallic') this.settingService.isNewUIDisplayed = true;
    else this.settingService.isNewUIDisplayed = false;

    this.currentSelectedTheme = cssFileName;
    this.settingService.setSessionStorageValue('currentSelectedTheme', this.currentSelectedTheme);
  }

  private getPageHeader() {
    this.headerService.pageHeader = new PageHeader();
    this.headerService.pageHeader.title = 'System-Settings';
  }

  private getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'system-setting',
      },
    ];
  }

  async setBiometric(event: any) {
    const isChecked = event.target.checked;
    let body = {
      enableFingerprintAuth: isChecked ? 'YES' : 'NO',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    try {
      let response = await this.http
        .post(`${this.settingService.getURLValue('MENU')}/securitySetting`, body, { headers })
        .toPromise();
      await this.settingService.load();
      console.log('API Response:', response);
    } catch (error) {
      console.error('Error fetching biometric:', error);
    }
  }
}
