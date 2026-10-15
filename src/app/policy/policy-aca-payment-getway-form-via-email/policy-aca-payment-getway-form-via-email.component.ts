import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@fullcalendar/core/internal';
import { ResponseIO } from 'src/app/models/responseIO';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { PolicyAcaPaymentGatewayFormViaEmailHandler } from './policy-aca-payment-getway-form-via-email.handler';

@Component({
  selector: 'sym-policy-aca-payment-getway-form-via-email',
  templateUrl: './policy-aca-payment-getway-form-via-email.component.html',
  styleUrls: ['./policy-aca-payment-getway-form-via-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyAcaPaymentGetwayFormViaEmailComponent
  extends PolicyAcaPaymentGatewayFormViaEmailHandler
  implements OnChanges
{
  policyID: string | null = null;
  private hasLoaded = false;
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
      console.log('policyID OnInit :', this.policyID);
      if (this.policyID) {
        this.loadData();
      }
    });
  }

  public loadData() {
    this.service.displayLoader(true);
    if (!this.policyID) {
      console.log('policyID: loadData method', this.policyID);
      this.service.displayLoader(false);
      return;
    }

    let modelNameBodyList = this.service.getModelNameBodyList(['Entity']);
    if (this.policyID) {
      this.service.load(this.policyID, modelNameBodyList).subscribe((successResponse) => {
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
        if (this.service.responseIO) {
          // console.log('after response:', this.service.responseIO.data.InitialPayment);
          window.localStorage.setItem('POLICYSEQ', this.service.responseIO.data.Entity.id);
          window.localStorage.setItem('EMAILTRIGGER', 'ACA');
          console.log('this.service.responseIO.data.Entity.id::', this.service.responseIO.data.Entity.id);
          window.localStorage.setItem('USERTYPE', this.service.responseIO.data.Entity.allocatedToRole);
          console.log(
            'this.service.responseIO.data.Entity.allocatedToRole::',
            this.service.responseIO.data.Entity.allocatedToRole
          );
          this.service.displayLoader(false);
          if (this.service.responseIO.data.Entity) {
            // setTimeout(()=>{
            this.payNowEmailCheck();
            // },10)
          }
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  payNowEmailCheck() {
    // const inwardId = this.service.responseIO?.data?.InitialPayment?.id;
    // if (!inwardId) {
    //   console.warn('inwardId not ready yet, delaying form submission');
    //   return;
    // }
    document.forms['paymentGatewayForm1'].submit();
  }
}
