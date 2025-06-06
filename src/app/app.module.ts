import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LucideAngularModule, DollarSign, TrendingUp, Activity, ArrowLeft, Check, XCircle, Filter, PlusCircle, Bell, User, Search, Info } from 'lucide-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { TrackOperationsComponent } from './components/track/track-operations/track-operations.component';
import { NewEfxOperationComponent } from './components/track/new-efx-operation/new-efx-operation.component';
import { EditOperationModalComponent } from './components/track/edit-operation-modal/edit-operation-modal.component';
import { SharedModule } from './components/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    TrackOperationsComponent,
    NewEfxOperationComponent,
    EditOperationModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    LucideAngularModule.pick({
      DollarSign,
      TrendingUp,
      Activity,
      ArrowLeft,
      Check,
      XCircle,
      Filter,
      PlusCircle,
      Bell,
      User,
      Search,
      Info
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }