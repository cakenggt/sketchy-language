import { getDrive } from "./utils/drive";
import { GetState } from "./utils/store";

let nextTodoId = 0;
export const addTodo = text => ({
  type: "ADD_TODO",
  id: nextTodoId++,
  text,
});

export const setVisibilityFilter = filter => ({
  type: "SET_VISIBILITY_FILTER",
  filter,
});

export const toggleTodo = id => ({
  type: "TOGGLE_TODO",
  id,
});

export const VisibilityFilters = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_COMPLETED: "SHOW_COMPLETED",
  SHOW_ACTIVE: "SHOW_ACTIVE",
};

export type ActionObject =
  | { type: "load-courses"; data: CourseListing[] }
  | { type: "load-course"; data: Course };

export interface Dispatch {
  <T extends ActionObject>(action: T): T;
  <T>(action: (dispatch: Dispatch, getState: GetState) => T): T;
}

const COURSES_SHEET_ID = "1UasxMyZEfCmOEvW_xCDMn5BaEyUAmRHtdGvvQx7Mli8";

export interface CourseListing {
  coursename: string;
  sheetid: string;
}

export const loadCourses = () => async (dispatch: Dispatch) => {
  const courses = (await getDrive(COURSES_SHEET_ID)) as CourseListing[];
  dispatch({ type: "load-courses", data: courses });
};

interface Metadata {
  attribute: string;
  value: string;
}

export interface CourseMetadata {
  learningLanguage: string;
  fromLanguage: string;
  learningLanguageHints: string;
  numSkills: number;
  skillSheet: string;
}

const getCourseAttributes = () =>
  new Set([
    "learningLanguage",
    "fromLanguage",
    "learningLanguageHints",
    "numSkills",
    "skillSheet",
  ]);

const convertCourseMetadata = (metadata: Metadata[]): CourseMetadata => {
  const courseAttributes = getCourseAttributes();
  const courseMetadata = metadata.reduce((acc, { attribute, value }) => {
    acc[attribute] = value;
    courseAttributes.delete(attribute);
    return acc;
  }, {});
  if (courseAttributes.size) {
    throw new Error("Course doesn't have all necessary attributes");
  }
  return courseMetadata as CourseMetadata;
};

interface SkillMetadata {
  name: string;
  sheetid: string;
}

interface Sentence {
  lesson: string;
  from: string;
  learning: string;
}

interface Challenge {
  type: string;
}

interface Lesson {
  challenges: Challenge[];
}

interface Skill {
  lessons: Lesson[];
  name: string;
}

interface HintTableEntry {
  from: string;
  learning: string;
}

export type Hints = Record<string, string[]>;

export interface Course extends CourseMetadata {
  hints: Hints;
  skills: Skill[];
}

export const loadSkill = async (
  docId: string,
  skillMetadata: SkillMetadata,
): Promise<Skill> => {
  const { name, sheetid } = skillMetadata;
  const sentences = await getDrive<Sentence>({
    sheet: docId,
    tab: sheetid,
  });
  const numLessons = sentences.reduce(
    (acc, { lesson }) => Math.max(acc, parseInt(lesson)),
    0,
  );
  const lessons = [];
  for (let i = 0; i < numLessons; i++) {
    const challenges: Challenge[] = [];
    const possibleSentences = sentences.filter(
      ({ lesson }) => lesson === i.toString(),
    );
    // TODO transform possibleSentences
    lessons[i] = { challenges };
  }
  return { name, lessons };
};

export const loadCourse = (docId: string) => async (dispatch: Dispatch) => {
  const courseMetadataListing = await getDrive<Metadata>(docId);
  const courseMetadata = convertCourseMetadata(courseMetadataListing);
  const skillMetadatas = await getDrive<SkillMetadata>({
    sheet: docId,
    tab: courseMetadata.skillSheet,
  });
  const hintTableEntries = await getDrive<HintTableEntry>({
    sheet: docId,
    tab: courseMetadata.learningLanguageHints,
  });
  const hints = hintTableEntries.reduce((acc, { from, learning }) => {
    acc[learning] = from.split(";");
    return acc;
  }, {});
  const course = {
    ...courseMetadata,
    hints,
    skills: [
      ...(await Promise.all(
        skillMetadatas.map(skillMetadata => loadSkill(docId, skillMetadata)),
      )),
    ],
  };
  dispatch({ type: "load-course", data: course });
};
