import { Injectable, Inject } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  map,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { Algorithm } from '@pvz/core/models/api-responses.model';
import { AllelesService } from '@pvz/core/services/alleles.service';
import {
  AllelesActionTypes,
  AllelesActions,
  LoadAlleles,
  LoadAllelesSuccess,
  LoadAllelesFail
} from '../actions/alleles.actions';

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class AllelesEffects {
  constructor(
    private actions$: Actions,
    private alleles: AllelesService,
  ) { }

  @Effect()
  search$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAlleles>(AllelesActionTypes.LoadAlleles),
    switchMap(action => {
      return this.alleles
        .query(action.payload)
        .pipe(
          map((alleles: Array<Algorithm>) => new LoadAllelesSuccess(alleles)),
          catchError(err => of(new LoadAllelesFail(err)))
        );
    })
  );
}
