import { createSelector, createFeatureSelector } from '@ngrx/store';
import { File } from '@pvz/core/models/file.model';
import * as fromRoot from '@pvz/reducers';
import * as fromLayout from './layout.reducer';
import * as fromProcesses from './processes.reducer';
import * as fromDropbox from './dropbox.reducer';

import { map, filter } from 'lodash-es';

export interface CoreState {
  layout: fromLayout.State;
  processes: fromProcesses.State;
  dropbox: fromDropbox.State;
}

export interface State extends fromRoot.State {
  core: CoreState;
}

export const reducers = {
  layout: fromLayout.reducer,
  processes: fromProcesses.reducer,
  dropbox: fromDropbox.reducer
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

/**LayoutActions
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */

export const getCoreState = createFeatureSelector<CoreState>('core');

export const getModalOpen = createSelector(
  getCoreState,
  core => core.layout.modalOpen
);

export const getModalConfig = createSelector(
  getCoreState,
  core => core.layout.modal
);

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them usable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */
export const getProcessesState = createSelector(
  getCoreState,
  core => core.processes
);

export const getProcessesMeta = createSelector(
  getCoreState,
  core => core.processes.meta
);

export const getDropboxState = createSelector(
  getCoreState,
  core => core.dropbox
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
} = fromProcesses.adapter.getSelectors(getProcessesState);

export const {
  selectEntities: getDropboxFiles,
  selectAll: getAllDropboxFiles,
} = fromDropbox.adapter.getSelectors(getDropboxState);

export const getRouteProcessId = createSelector(
  fromRoot.getRouterState,
  router => router.state.params.processId
)

export const getRouteFileId = createSelector(
  fromRoot.getRouterState,
  router => router.state.params.fileId
)

export const getSelectedProcess = createSelector(
  getProcesses,
  getRouteProcessId,
  (processes, processId) => { return processes[processId]; }
);


export const getProcess = (id: number) => createSelector(
  getProcesses,
  processes => processes[id]
);

export const getProcessesWithVisualizableFiles = createSelector(
  getAllProcesses,
  (processes) => {
    return map(processes)
      .filter((proc) => {
        const vizFiles = filter(proc.files, (file) => {
          return file.is_visualizable === true;
        });
        return vizFiles.length > 0;
        // console.log('proc!');
        // return filter(proc.files, (file) => {
        //   return (file.display_name.includes('final\.tsv') || file.display_name.includes('combined\.parsed\.tsv' ));
        // }) > 0;
      });
  })

export const getDropboxVisualizableFiles = createSelector(
  getDropboxFiles,
  (files) => {
    return map(files)
      .filter(file => isVisualizable(file.display_name));
  }
)

function isVisualizable(display_name) {
  return (display_name.includes('final\.tsv') || display_name.includes('combined\.parsed\.tsv'));
}

export const getSelectedFile = createSelector(
  getSelectedProcess,
  getAllDropboxFiles,
  getRouteProcessId,
  getRouteFileId,
  (process, files, processId, fileId) => {
    console.log(`GETSELECTED FILE processID: ${processId}`);
    let file: File;
    if (processId > 0) {
      file = process ? process.files.filter(f => f.fileID === fileId)[0] : undefined;
    } else {
      file = getDropboxFile(files, fileId);
      console.log('FOUND DROPBOX FILE:');
      console.log(file)
    }
    return file;
  }
);

function getDropboxFile(data, id) {
  function iter(a) {
    if (a.fileID === id) {
      result = a;
      return true;
    }
    return Array.isArray(a.contents) && a.contents.some(iter);
  }

  var result;
  data.some(iter);
  return result
}
