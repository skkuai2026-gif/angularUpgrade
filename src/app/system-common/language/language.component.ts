import { BreadCrumb } from './../../models/common/bread-crumb';
import { HeaderService } from './../services/header.service';
import { Router } from '@angular/router';
import { LoginService } from './../services/login.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageHeader } from 'src/app/models/common/page-header';

@Component({
  selector: 'sym-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LanguageComponent implements OnInit {
  public languageList: any[];
  public selectedLanguage: string;
  public breadCrumbList: BreadCrumb[];
  constructor(
    public settingService: SettingService,
    private loginService: LoginService,
    private router: Router,
    public headerService: HeaderService
  ) {
    // this.getPageHeader();
  }

  ngOnInit() {
    this.breadCrumbList = [];
    this.breadCrumbList = this.getBreadCrumbList();
    this.getAllLanuages();
  }

  private getAllLanuages() {
    this.loginService.init().subscribe(
      (languageList): any => {
        // console.log('Languages: ' + JSON.stringify(languageList["data"].language));
        this.languageList = JSON.parse(JSON.stringify(languageList['data'].language));
      },
      (error) => {
        console.log('All Language list loading failed.');
        console.log('Error:', error);
      }
    );
  }

  async onLanguageSelect() {
    await this.settingService.setLanguage(this.selectedLanguage);
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      // console.log(currentUrl);
    });
  }
  private getPageHeader() {
    this.headerService.pageHeader = new PageHeader();
    this.headerService.pageHeader.title = 'changeLanguage';
  }
  private getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'changeLanguage',
      },
    ];
  }
}
