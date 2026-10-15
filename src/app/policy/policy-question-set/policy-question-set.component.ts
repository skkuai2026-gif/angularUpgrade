import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import data from 'src/assets/config/url-config.json';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { PolicyQuestionSetHandlerComponent } from './policy-question-set.handler';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'sym-policy-question-set',
  templateUrl: './policy-question-set.component.html',
  styleUrls: ['./policy-question-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PolicyQuestionSetComponent
  extends PolicyQuestionSetHandlerComponent
  implements OnChanges
{
  companySUNPH: any;
  isMonthlyApplicableFlag: any;
  constructor(
    public policyService: PolicyService,
    public settingService: SettingService,
    protected uppercasePipe: UpperCasePipe
  ) {
    super(policyService, settingService, uppercasePipe);

    const url: any = (data as any).default ?? data;
    this.companySUNPH = url?.[1]?.companySUNPH;
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.service.getMonthlyModeApplicable().subscribe((resp) => {
    //     console.log('3444444444');
    //     var respData = JSON.parse(JSON.stringify(resp));
    //     this.isMonthlyApplicableFlag = respData?.data.isMonthlyModeApplicable;
    //   });
    // }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  ngAfterViewInit() {
    const self = this;
    setTimeout(() => {
      $('#panel_wrapperSPAb').on('click', '.tooltip-label-info', (event) => {
        this.specialPaymentArrangementPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPAbMonthly').on(
        'click',
        '.tooltip-label-info',
        (event) => {
          this.specialPaymentArrangementPopup();
        }
      );
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPAMonthly').on(
        'click',
        '.tooltip-label-info',
        (event) => {
          this.specialPaymentArrangementPopup();
        }
      );
    }, 0);
    setTimeout(() => {
      $('#panel_WrapperSpaMONTHLY').on(
        'click',
        '.tooltip-label-info',
        (event) => {
          this.specialPaymentArrangementPopup();
        }
      );
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPAInsured').on(
        'click',
        '.tooltip-label-info',
        (event) => {
          this.specialPaymentArrangementPopup();
        }
      );
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPASIO').on('click', '.tooltip-label-info', (event) => {
        this.specialPaymentArrangementPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPAa').on('click', '.tooltip-label-info', (event) => {
        this.specialPaymentArrangementPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPASIOMonthly').on(
        'click',
        '.tooltip-label-info',
        (event) => {
          this.specialPaymentArrangementPopup();
        }
      );
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSPA').on('click', '.tooltip-label-info', (event) => {
        this.specialPaymentArrangementPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSANew').on('click', '.tooltip-label-info', (event) => {
        this.specialPaymentArrangementPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#panel_wrapperSIOMonthly').on(
        'click',
        '.tooltip-label-info',
        (event) => {
          this.specialPaymentArrangementPopup();
        }
      );
    }, 0);
    if (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED') {
      $(document).ready(function () {
        $('#panel_WrapperSpaMONTHLY .btnAddTab').prop('disabled', true);
        $('#panel_WrapperSpaMONTHLY .datadeletebtn').prop('disabled', true);
      });
    }
    if (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED') {
      $(document).ready(function () {
        $('#panel_wrapperSPAInsured .btnAddTab').prop('disabled', true);
        $('#panel_wrapperSPAInsured .datadeletebtn').prop('disabled', true);
      });
    }
    if (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED') {
      $(document).ready(function () {
        $('#panel_wrapperSPASIO .btnAddTab').prop('disabled', true);
        $('#panel_wrapperSPASIO .datadeletebtn').prop('disabled', true);
      });
    }
    if (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED') {
      $(document).ready(function () {
        $('#panel_wrapperSPAa .btnAddTab').prop('disabled', true);
        $('#panel_wrapperSPAa .datadeletebtn').prop('disabled', true);
      });
    }
  }
  specialPaymentArrangementPopup() {
    this.openModal('specialPaymentArrangementPopup');
  }

  ngOnDestroy() {
    // this.closeModal('specialPaymentArrangementPopup');
  }
}
