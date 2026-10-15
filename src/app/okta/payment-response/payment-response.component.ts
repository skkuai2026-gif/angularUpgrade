import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
declare const paymentResponseClose: any;
import data from 'src/assets/config/url-config.json';

@Component({
  selector: 'sym-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PaymentResponseComponent implements OnInit {
  companySUNPH;
  emailTrigger: string | null = null;
  userType: string | null = null;
  constructor(private router: Router) {
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
    // console.log('url:::', url);
  }

  ngOnInit() {
    console.log('paymentresponse ngoninit called...');
    var policyid = window.localStorage.getItem('POLICYSEQ');
    this.userType = window.localStorage.getItem('USERTYPE');
    this.emailTrigger = window.localStorage.getItem('EMAILTRIGGER');
    console.log('companySUNPH:', this.companySUNPH);
    console.log('policyid:', policyid);
    console.log('userType:', this.userType);
    console.log('userType:', this.emailTrigger);
    // if (this.companySUNPH == 'SLOCPI') {
    setTimeout(() => {
      if (this.userType == 'AGENT') {
        console.log('payment-response component ngoninit if called');
        // window.localStorage.setItem('PAYMENTCALLBACK', 'BASIC');
        // this.router.navigate(['policy/' + policyid]);
      } else {
        this.router.navigate(['policy-customer/' + policyid]);
      }
    }, 3000);
    // } else {
    //   if (userType == 'AGENT') {
    //     console.log('payment-response component ngoninit if called');
    //     // window.localStorage.setItem('PAYMENTCALLBACK', 'BASIC');
    //     // this.router.navigate(['policy/' + policyid]);
    //   } else {
    //     this.router.navigate(['policy-customer/' + policyid]);
    //   }
    // }
  }
}
