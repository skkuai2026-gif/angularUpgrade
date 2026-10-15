import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LandingQuotationSearchComponent } from './landing-quotation-search/landing-quotation-search.component';
import { LandingFnaSearchComponent } from './landing-fna-search/landing-fna-search.component';
import { LandingLeadSearchComponent } from './landing-lead-search/landing-lead-search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPolicySearchComponent } from './landing-policy-search/landing-policy-search.component';
import { SystemCommonModule } from '../system-common/system-common.module';
// import { ChatbotComponent } from './chatbot/chatbot.component';
import { NbDashboardComponent } from './nb-dashboard/nb-dashboard.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { LandingLeadsProgressionComponent } from './landing-leads-progression/landing-leads-progression.component';
// import { AgentNotificationSearchComponent } from './agent-notification-search/agent-notification-search.component';
import { SunSmartAppComponent } from './sunsmart-app/sunsmart-app.component';
// import { ChartsModule } from 'ng2-charts';

// FullCalendarModule.registerPlugins([
//   // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin,
// ]);

@NgModule({
  declarations: [
    LandingPageComponent,
    LandingLeadsProgressionComponent,
    LandingLeadSearchComponent,
    LandingFnaSearchComponent,
    LandingQuotationSearchComponent,
    LandingPolicySearchComponent,
    // ChatbotComponent,
    NbDashboardComponent,
    // AgentNotificationSearchComponent,
    SunSmartAppComponent,
  ],
  imports: [
    // ChartsModule,
    CommonModule,
    HomeRoutingModule,
    SystemCommonModule,
    FormsModule,
    BrowserModule,
    FullCalendarModule, // register FullCalendar with your app
  ],
})
export class HomeModule {}
