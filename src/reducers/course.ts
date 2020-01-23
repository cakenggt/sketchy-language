import { ActionObject } from "../actions";

export const courses = (state = [], action: ActionObject) => {
  switch (action.type) {
    case "load-courses":
      return action.data;
    default:
      return state;
  }
};

export const course = (state = {}, action: ActionObject) => {
  switch (action.type) {
    case "load-course":
      return action.data;
    default:
      return state;
  }
};
