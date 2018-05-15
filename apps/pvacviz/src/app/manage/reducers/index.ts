import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromNgrxRouter from '@ngrx/router-store';

import * as fromManage from './manage.reducer';
import * as fromRoot from '../../reducers';
import { RouterStateUrl } from '../../core/models/router.model';

export interface ManageState {
  processes: fromManage.State;
}

export interface State extends fromRoot.State {
  processes: ManageState;
}

export const reducers = {
  processes: fromManage.reducer
}


/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `processes` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 *   constructor(state$: Observable<State>) {
 *     this.processeState$ = state$.pipe(select(getProcesseState));
 *   }
 * }
 * ```
 */

export const getRouterState = createFeatureSelector<fromNgrxRouter.RouterReducerState<RouterStateUrl>>('router');

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getManageState = createFeatureSelector<ManageState>('processes');

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them usable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */
export const getProcessEntitiesState = createSelector(
  getManageState,
  state => state.processes
);

/**
 * Adapters created with @ngrx/entity generate
 * commonly used selector functions including
 * getting all ids in the record set, a dictionary
 * of the records by id, an array of records and
 * the total number of records. This reduces boilerplate
 * in selecting records from the entity state.
 */
export const {
  selectEntities: getProcesses,
  selectAll: getAllProcesses,
} = fromManage.adapter.getSelectors(getProcessEntitiesState);

export const getRouteProcessId = createSelector(
  getRouterState,
  router => router.state.params.processId
)

export const getSelectedProcess = createSelector(
  getProcesses,
  getRouteProcessId,
  (processes, processId) => { return processes[processId]; }
);

export const getSelectedProcessLog = createSelector(
  getSelectedProcess,
  (process) => { return Boolean(process) ? process.log : undefined; }
);

export const getSelectedProcessParameters = createSelector(
  getSelectedProcess,
  (process) => { return Boolean(process) ? process.parameters : undefined; }
);
