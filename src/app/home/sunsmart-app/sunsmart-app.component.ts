import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from 'src/app/lead/services/lead.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import data from 'src/assets/config/url-config.json';

declare const openModal: any;
declare const closeModal: any;

@Component({
  selector: 'sym-sunsmart-app',
  templateUrl: './sunsmart-app.component.html',
  styleUrls: ['./sunsmart-app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SunSmartAppComponent extends BaseComponent<LeadService> implements OnInit {
  public companySUNPH;
  redemptionCode: string = '';
  isRedemptionSectionVisible = false;
  agentID: any;
  lookupFrqAskedQues: any;
  activeIndices: number[] = [];
  appstoreURL: any;
  userNameUpperCase;
  @ViewChild('redemptionDiv') redemptionDiv!: ElementRef;

  constructor(public leadService: LeadService, public settingService: SettingService) {
    super(leadService);
  }
  ngOnInit() {
    const userdata = this.service.getUserLoginData();
    this.agentID = userdata?.['UserId'];
    this.getCompanyName();
    this.loadNewRedemptionCode(false);
  }
  getCompanyName() {
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
  }
  showRedemptionSection(): void {
    this.isRedemptionSectionVisible = true;

    setTimeout(() => {
      if (this.redemptionDiv && this.redemptionDiv.nativeElement) {
        this.redemptionDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  generateNewRedemptionCode() {
    openModal('getSunSmartApp');
  }
  closeRedemptionCodePopup() {
    closeModal('getSunSmartApp');
    event.preventDefault();

    setTimeout(() => {
      if (this.redemptionDiv && this.redemptionDiv.nativeElement) {
        this.redemptionDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  hideShow(index: number) {
    const pos = this.activeIndices.indexOf(index);
    if (pos > -1) {
      // Already open, so close it
      this.activeIndices.splice(pos, 1);
    } else {
      // Not open, so open it
      this.activeIndices.push(index);
    }
  }

  loadNewRedemptionCode(isNewRedmpionCodeRequired: any) {
    this.service.loadRedemptionCode(isNewRedmpionCodeRequired, this.agentID).subscribe(
      (successResponse) => {
        let responseIO: any = JSON.parse(JSON.stringify(successResponse));
        this.lookupFrqAskedQues = [responseIO.data.faqValue, responseIO.data.faqs];
        this.redemptionCode = responseIO.data.redemptionCode;
        this.appstoreURL = responseIO.data.URL;
        if (isNewRedmpionCodeRequired) {
          this.closeRedemptionCodePopup();
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  copyText(element) {
    const textToCopy = element.innerText || element.textContent;
    const input = document.createElement('input');
    input.value = textToCopy;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
