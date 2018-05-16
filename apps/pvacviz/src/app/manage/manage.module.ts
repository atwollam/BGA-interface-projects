import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ManageRoutingModule } from './manage-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MomentModule } from 'ngx-moment';

import { ProcessEffects } from './effects/manage.effects';
import { reducers } from './reducers';

import { ManagePageComponent } from './containers/manage-page/manage-page.component';
import { ProcessPageComponent } from './containers/process-page/process-page.component';
import { ProcessTableComponent } from './components/process-table/process-table.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    MomentModule,
    ManageRoutingModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('processes', reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([ProcessEffects])
  ],
  declarations: [ManagePageComponent, ProcessPageComponent, ProcessTableComponent]
})
export class ManageModule { }
