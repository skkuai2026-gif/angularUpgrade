import { Input, OnChanges, SimpleChanges } from '@angular/core';

import { LeadService } from '../services/lead.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

export class LeadActivityHandlerComponent
    extends BaseComponent<LeadService>
    implements OnChanges {
    constructor(leadService: LeadService) {
        super(leadService);
    }

    public onAddLeadActivity(event) {
        this.service.addLeadActivity().subscribe(
            (body) => {
                let response: any;
                response = JSON.parse(JSON.stringify(body));
                //console.log(response);
                let newLeadActivityList = [];
                Array.prototype.push.apply(
                    newLeadActivityList,
                    this.service.responseIO.data.LeadActivityList
                );
                newLeadActivityList.push(response.data.LeadActivity);
                //need to change the entire array instance in order to reflect in the dom
                this.service.responseIO.data.LeadActivityList = [];
                this.service.responseIO.data.LeadActivityList = newLeadActivityList;
                this.service.refreshMetaData(response);
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    onDeleteSelected(item) {
        this.service.setDeleted(item);
    }
}
