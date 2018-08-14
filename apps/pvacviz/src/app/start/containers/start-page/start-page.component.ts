import { Component, Input, forwardRef, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { FormGroupState, ResetAction, SetValueAction, unbox } from 'ngrx-forms';

import { StartFormGroupValue, StartFormGroupInitialState } from '@pvz/start/models/start.models';

import { File, Files } from '@pvz/core/models/file.model';
import { Algorithm, Allele } from '@pvz/core/models/api-responses.model';
import { InputService } from '@pvz/core/services/inputs.service';

import * as fromInputsActions from '@pvz/start/actions/inputs.actions';
import * as fromAllelesActions from '@pvz/start/actions/alleles.actions';
import * as fromAlgorithmsActions from '@pvz/start/actions/algorithms.actions';
import * as fromStartActions from '@pvz/start/actions/start.actions';
import * as fromStart from '@pvz/start/reducers';

@Component({
  selector: 'pvz-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {
  private subscriptions = [];
  formState$: Observable<FormGroupState<StartFormGroupValue>>;
  submittedValue$: Observable<StartFormGroupValue | undefined>;

  postSubmitting$: Observable<boolean>;
  postSubmitted$: Observable<boolean>;
  postMessage$: Observable<string>;
  postError$: Observable<boolean>;

  inputs$: Observable<Files>;
  algorithms$: Observable<Array<Algorithm>>;
  // TODO: figure out why Observable<Array<any>> below throws a type error
  alleles$: Observable<Array<any>>;
  newProcessId$: Observable<number>;

  netChopMethodOptions;
  topScoreMetricOptions;

  constructor(
    private store: Store<fromStart.State>,
  ) {
    this.formState$ = store.pipe(select(fromStart.getFormState), map(s => s.state));
    this.submittedValue$ = store.pipe(select(fromStart.getFormState), map(s => s.submittedValue));

    this.inputs$ = store.pipe(select(fromStart.getAllInputs), map((inputs) => {
      let options = [];
      let dir = '~pVAC-Seq';

      function groupFiles(dir, contents) {
        contents.forEach((item) => {
          if (item.type === "file") {
            let option = {
              display_name: item.display_name,
              fileID: item.fileID,
              directory: dir
            }
            options.push(option);
          } else if (item.type === "directory") {
            dir = dir + '/' + item.display_name;
            groupFiles(dir, item.contents);
          }
        })
      }
      groupFiles(dir, inputs);
      return options;
    }));

    this.alleles$ = store.pipe(select(fromStart.getAllAlleles))

    this.algorithms$ = store.pipe(select(fromStart.getAllAlgorithms));
    this.postSubmitting$ = store.pipe(select(fromStart.getStartState), map(state => state.post.submitting));
    this.postSubmitted$ = store.pipe(select(fromStart.getStartState), map(state => state.post.submitted));
    this.postMessage$ = store.pipe(select(fromStart.getStartState), map(state => state.post.message));
    this.postError$ = store.pipe(select(fromStart.getStartState), map(state => state.post.error));
    this.newProcessId$ = store.pipe(select(fromStart.getStartState), map(state => state.post.processid));

    this.netChopMethodOptions = [
      { label: 'C term 3.0', value: 'cterm' },
      { label: '20S 3.0', value: '20s' },
    ];

    this.topScoreMetricOptions = [
      { label: 'Median Score', value: 'median' },
      { label: 'Lowest Score', value: 'lowest' },
    ];
  }

  ngOnInit() {
    this.store.dispatch(new fromInputsActions.LoadInputs());
    this.store.dispatch(new fromAlgorithmsActions.LoadAlgorithms());
    this.store.dispatch(new fromAllelesActions.LoadAlleles(['MHCflurry', 'NetMHCIIpan']));
  }

  onAllelesUpdate() {
    console.log('------- algorithms changed, updating alleles')
    let subscription = this.formState$.subscribe((form) => {
      const newAlleles = unbox(form.value.alleles);
      this.store.dispatch(new fromAllelesActions.LoadAlleles(newAlleles));
    });
    this.subscriptions.push(subscription);
  }

  onSubmit(startParameters): void {
    this.store.dispatch(new fromStartActions.StartProcess(startParameters));
  }

  onDestroy() {
    console.log('------- Destroying Start page subscriptions');
    if (this.subscriptions.length > 0) { this.subscriptions.forEach(sub => sub.unsubscribe()); }
  }
}
