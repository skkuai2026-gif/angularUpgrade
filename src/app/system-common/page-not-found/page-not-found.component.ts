import { AuthService } from './../../auth.service';
import data from 'src/assets/config/url-config.json';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'sym-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PageNotFoundComponent implements OnInit {
  companySUNPH: any;
  constructor(public authService: AuthService, public settingService: SettingService) {
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
  }

  ngOnInit() {}
}
