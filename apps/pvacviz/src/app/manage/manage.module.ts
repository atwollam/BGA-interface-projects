import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ManageRoutingModule } from './manage-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MomentModule } from 'ngx-moment';

// misc
import { PrettyJsonModule } from 'angular2-prettyjson';

import { ManageEffects } from './effects/manage.effects';
import { reducers } from './reducers';

import { SharedComponentsModule } from '@pvz/core/shared-components.module';

import { ManagePageComponent } from './containers/manage-page/manage-page.component';
import { ProcessPageComponent } from './containers/process-page/process-page.component';
import { ProcessTableComponent } from './components/process-table/process-table.component';



@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    MomentModule,
    ManageRoutingModule,
    SharedComponentsModule,
    PrettyJsonModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('manage', reducers),
    EffectsModule.forFeature([
      ManageEffects,
    ]),
  ],
  declarations: [
    ManagePageComponent,
    ProcessPageComponent,
    ProcessTableComponent
  ]
})
export class ManageModule { }
