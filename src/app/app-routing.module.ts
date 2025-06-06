import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SellJourneyComponent } from './components/sell/sell-journey/sell-journey.component';
import { BuyJourneyComponent } from './components/buy/buy-journey/buy-journey.component';
import { TrackOperationsComponent } from './components/track/track-operations/track-operations.component';
import { NewEfxOperationComponent } from './components/track/new-efx-operation/new-efx-operation.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'sell', loadChildren: () => import('./components/sell/sell.module').then(m => m.SellModule) },
  { path: 'buy', loadChildren: () => import('./components/buy/buy.module').then(m => m.BuyModule) },
  { path: 'track', component: TrackOperationsComponent },
  { path: 'group-efx-operations', component: NewEfxOperationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }