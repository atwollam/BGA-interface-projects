import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AlgorithmsActions, AlgorithmsActionTypes } from '@pvz/start/actions/algorithms.actions';
import { Algorithm } from '@pvz/core/models/api-responses.model';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is then extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Algorithm> {
  loading: boolean;
  loaded: boolean;
  error: boolean;
  errorMessage?: string;
}

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Algorithm> = createEntityAdapter<Algorithm>({
  sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: false,
  errorMessage: null
});

export function reducer(state = initialState, action: AlgorithmsActions): State {
  switch (action.type) {

    case AlgorithmsActionTypes.LoadAlgorithms:
      return {
        ...state,
        loading: true,
      };

    case AlgorithmsActionTypes.LoadAlgorithmsSuccess:
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(action.payload, state),
        loading: false,
        loaded: true,
        error: false
      };

    case AlgorithmsActionTypes.LoadAlgorithmsFail:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: false,
        errorMessage: action.payload.message
      }

    default:
      return state;
  }
}
