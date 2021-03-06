import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { CourseListing, Course } from "../actions";

export interface State {
  course: Course;
  courses: CourseListing[];
}

export type GetState = () => State;

export const configureStore = rootReducer =>
  createStore(rootReducer, applyMiddleware(logger, thunk));
