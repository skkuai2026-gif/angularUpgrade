import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseIO } from 'src/app/models/responseIO';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { PolicyPaymentGatewayEmailFormHandler } from './policy-payment-gateway-email-form.handler';

@Component({
  selector: 'sym-policy-payment-gateway-email-form',
  templateUrl: './policy-payment-gateway-email-form.component.html',
  styleUrls: ['./policy-payment-gateway-email-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPaymentGatewayEmailFormComponent
  extends PolicyPaymentGatewayEmailFormHandler
  implements OnChanges
{
  policyID: string | null = null;
  isLoaded = false;
  constructor(
    private policyService: PolicyService,
    public settingService: SettingService,
    private route: ActivatedRoute
  ) {
    super(policyService, settingService);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.policyID = params.get('id');
      console.log('policyID :', this.policyID);
      if (this.policyID) {
        this.loadData();
      }
    });
  }

  public loadData() {
    this.service.displayLoader(true);
    if (!this.policyID) {
      console.log('policyID:', this.policyID);
      this.service.displayLoader(false);
      return;
    }

    let modelNameBodyList = this.service.getModelNameBodyList([
      'Entity',
      'InitialOtherPayerParty',
      'InitialPayment',
      'PayerInwardList',
      'RenewalOtherPayerParty',
      'RefundPayment',
    ]);

    if (this.policyID) {
      this.service.load(this.policyID, modelNameBodyList).subscribe((successResponse) => {
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
        console.log('after response:', this.service.responseIO.data.InitialPayment);
        window.localStorage.setItem('POLICYSEQ', this.service.responseIO.data.Entity.id);
        window.localStorage.setItem('EMAILTRIGGER', 'CPAG');
        window.localStorage.setItem('USERTYPE', this.service.responseIO.data.Entity.allocatedToRole);
        this.service.displayLoader(false);
        if (this.service.responseIO.data.InitialPayment) {
          // setTimeout(()=>{
          this.payNowEmailCheck();
          // },10)
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  payNowEmailCheck() {
    const inwardId = this.service.responseIO?.data?.InitialPayment?.id;
    if (!inwardId) {
      console.warn('inwardId not ready yet, delaying form submission');
      return;
    }
    document.forms['paymentGatewayForm'].submit();
  }
}
