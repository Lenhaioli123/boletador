import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { SellJourneyComponent } from './sell-journey/sell-journey.component';
import { SellStep1Component } from './sell-step1/sell-step1.component';
import { SellStep2Component } from './sell-step2/sell-step2.component';

const routes: Routes = [
  { 
    path: '', 
    component: SellJourneyComponent,
    children: [
      { path: '', component: SellStep1Component },
      { path: 'step2', component: SellStep2Component },
      { path: 'success', component: SellStep1Component } // Placeholder for success
    ]
  }
];

@NgModule({
  declarations: [
    SellJourneyComponent,
    SellStep1Component,
    SellStep2Component
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SellModule { }