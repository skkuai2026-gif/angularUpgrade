import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FnaService } from '../service/fna-service.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/system-common/base/base.component';
declare const setSignatureHeight: any;

@Component({
  selector: 'sym-fna-signature',
  templateUrl: './fna-signature.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-signature.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaSignatureComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  serviceSignature: any;
  constructor(public service: FnaService, public router: Router) {
    super(service);
    this.serviceSignature = this.service.getSignature();
  }

  ngOnInit() {}

  setSignatureHeight() {
    setTimeout(() => {
      setSignatureHeight();
    }, 10);
  }
}
