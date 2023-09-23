import { IndexPageAction, IndexPageState} from './types';

const INIT_STATE = (): IndexPageState => ({
  age: undefined,
  expectedResult: undefined,
  gender: undefined,
  mbtiType: undefined
});

const reducer = (state: IndexPageState, action: IndexPageAction) => {
  let newState = { ...state };
  switch (action.type) {
    case 'setage':
      newState.age = action.age
      break;
    case 'setexpectedResult':
      newState.expectedResult= action.expectedResult;
      break;
    case 'setgender':
      newState.gender = action.gender;
      break;
    case 'setmbtiType':
      newState.mbtiType = action.mbtiType || '';
      break;
    case 'clear':
      newState = { ...INIT_STATE() };
      break;
    case 'setwholestate':
      if (!action) {
        break;
      }
      newState = { ...newState, ...action };
      break;
  }
  return newState;
};

export const IndexPageReducer = {
  reducer,
  INIT_STATE,
};
