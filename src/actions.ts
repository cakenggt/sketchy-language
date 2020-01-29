import _ from "underscore";

import { getDrive } from "./utils/drive";
import { GetState } from "./utils/store";
import {
  forwardTranslateChallengeGenerator,
  reverseTranslateChallengeGenerator,
  forwardJudgeChallengeGenerator,
  reverseJudgeChallengeGenerator,
  Challenge,
} from "./utils/generators";
import { getItem, StorageKey, setItem } from "./utils/localStorage";

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

export interface Sentence {
  lesson: string;
  from: string;
  learning: string;
}

export interface Lesson {
  challenges: Challenge[];
}

export interface Skill {
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
  courseMetadata: CourseMetadata,
  skillMetadata: SkillMetadata,
  hints: Hints,
): Promise<Skill> => {
  const { name, sheetid } = skillMetadata;
  const { fromLanguage, learningLanguage } = courseMetadata;

  const sentences = await getDrive<Sentence>({
    sheet: docId,
    tab: sheetid,
  });

  const numLessons = sentences.reduce(
    (acc, { lesson }) => Math.max(acc, parseInt(lesson)),
    0,
  );

  const lessons: Lesson[] = [];
  for (let i = 0; i < numLessons; i++) {
    const challenges: Challenge[] = [];
    const possibleSentences = sentences.filter(
      ({ lesson }) => lesson === (i + 1).toString(),
    );
    const generators = [
      forwardTranslateChallengeGenerator,
      reverseTranslateChallengeGenerator,
      forwardJudgeChallengeGenerator,
      reverseJudgeChallengeGenerator,
    ].map(generator =>
      generator(fromLanguage, learningLanguage, hints, possibleSentences),
    );

    const firstTen = _.chunk<Sentence>(
      _.shuffle(possibleSentences),
      10,
    )[0] as Sentence[];

    firstTen.forEach(sentence => {
      challenges.push(
        generators[Math.floor(Math.random() * generators.length)](sentence),
      );
    });
    lessons.push({ challenges });
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
        skillMetadatas.map(skillMetadata =>
          loadSkill(docId, courseMetadata, skillMetadata, hints),
        ),
      )),
    ],
  };
  dispatch({ type: "load-course", data: course });
};

export type Progress = Record<string, Record<string, number>>;

export const setProgress = (
  courseId: string,
  skill: string,
  lesson: number,
) => {
  const currentProgress = getItem(StorageKey.Progress) ?? ({} as Progress);
  const courseProgress = currentProgress[courseId] ?? {};
  courseProgress[skill] = lesson;
  currentProgress[courseId] = courseProgress;
  setItem(StorageKey.Progress, JSON.stringify(currentProgress));
};
