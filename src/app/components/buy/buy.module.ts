import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { BuyJourneyComponent } from './buy-journey/buy-journey.component';
import { BuyStep1Component } from './buy-step1/buy-step1.component';

const routes: Routes = [
  { 
    path: '', 
    component: BuyJourneyComponent,
    children: [
      { path: '', component: BuyStep1Component },
      // Add more buy steps here as needed
    ]
  }
];

@NgModule({
  declarations: [
    BuyJourneyComponent,
    BuyStep1Component
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BuyModule { }