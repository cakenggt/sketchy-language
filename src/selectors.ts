import { State } from "./utils/store";
import { getItem, StorageKey } from "./utils/localStorage";
import { Progress } from "./actions";

export const coursesSelector = (s: State) => s.courses;

export const courseSelector = (s: State) => s.course;

export const skillSelector = (s: State) => (skillId: number) =>
  courseSelector(s)?.skills?.[skillId - 1];

export const lessonSelector = (s: State) => (
  skillId: number,
  lessonId: number,
) => skillSelector(s)(skillId)?.lessons?.[lessonId - 1];

export const progressSelector = () =>
  getItem(StorageKey.Progress) ?? ({} as Progress);
