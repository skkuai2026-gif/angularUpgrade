import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
declare const initFnaSlider: any;
declare const initSlickSlider: any;
@Component({
  selector: 'sym-fna-buy-product',
  templateUrl: './fna-buy-product.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-buy-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaBuyProductComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  fnaSlideScreen: any[];
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
    this.fnaSlideScreen = [
      {
        html: `<span>If anything should happen to me, I just don't want to <strong>burden my family</strong></span>`,
      },
      {
        html: `<span>I want to make sure my <strong>family and children are provided for</strong> if I’m gone</span>`,
      },
      {
        html: `<span>I don’t want to rely on anyone to enjoy a <strong>comfortable living</strong></span>`,
      },

      {
        html: `<span>I am <strong>worried about major health issues</strong> like cancer</span>`,
      },

      {
        html: `<span>My <strong>children’s health and safety</strong> is what keeps me up at night</span>`,
      },
      {
        html: `<span >I’m getting <strong>older</strong> and <strong>my health is deteriorating</strong>, I want to be able to pay the <strong>hospital bills</strong></span>`,
      },
      {
        html: `<span>I don’t know if I will have <strong>enough money to take care of my health</strong></span>`,
      },
      {
        html: `<span>My interests and hobbies consume my salary, I want to <strong>keep aside some</strong> for future</span>`,
      },
      {
        html: `<span >I <strong>don’t want to sweat over investments</strong>, want to let them run their course</span>`,
      },
      {
        html: `<span>Need to <strong>plan finances for the future</strong> and prepare to take care of my parents in future</span>`,
      },
      {
        html: `<span>Properties are getting expensive, I want to <strong>leave some money to help my children</strong></span>`,
      },
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.settingService.getApplicationMode() == 'online') {
        initFnaSlider();
      } else if (this.settingService.getApplicationMode() == 'offline') {
        setTimeout(() => {
          var sliderElement = $('.sliderContainer');
          initSlickSlider(sliderElement);
        }, 15);
      }
    }, 150);
  }

  onInputChanged(event) {
    // let key: string = event.target.value
    //   .replaceAll('<span>', '')
    //   .replaceAll('</span>', '')
    //   .replaceAll('<strong>', '')
    //   .replaceAll('</strong>', '');
    // this.service.fnaStepQuestionnaire[this.selectedTab][key] = event.target.checked;
    // console.log(this.service.fnaStepQuestionnaire);
  }
}
