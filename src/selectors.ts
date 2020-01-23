import { State } from "./utils/store";

export const coursesSelector = (s: State) => s.courses;

export const courseSelector = (s: State) => s.course;
