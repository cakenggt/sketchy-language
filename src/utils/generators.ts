import { shuffle } from "underscore";

import { Hints } from "../actions";
import { HintTable, getHintTable, getTokens } from "./hintTable";

const tokenizer = (str: string): string[] =>
  str.split(/[\s,.:!?]/).filter(s => !!s);

const whitespaceTokenizer = (str: string): string[] => str.split(/([\s,.:!?])/);

interface TranslateChallenge {
  sourceLanguage: string;
  targetLanguage: string;
  prompt: string;
  choices: { tts: null; text: string }[];
  correctIndices: number[];
  compactTranslations: string[];
  correctSolutions: string[];
  correctTokens: string[];
  wrongTokens: string[];
  type: "translate";
  tokens: {
    value: string;
    tts?: string;
    hintTable?: HintTable;
  }[];
}

interface JudgeChallenge {
  sourceLanguage: string;
  targetLanguage: string;
  prompt: string;
  choices: string[];
  correctIndices: number[];
  type: "judge";
}

export interface Sentence {
  en: string;
  "xx-TP": string;
}

const translateChallengeGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
) => (sentence: Sentence, hints: Hints): TranslateChallenge => {
  const targetTokens = tokenizer(sentence[targetLanguage]).map(t => ({
    tts: null,
    text: t,
  }));
  const existingTokens: Record<string, boolean> = {};
  targetTokens.forEach(t => (existingTokens[t.text] = true));
  const numDistractors = Math.min(targetTokens.length, 10);
  const distractors = shuffle<string>(getTokens(hints))
    .filter(t => !existingTokens[t])
    .slice(0, numDistractors)
    .map(t => ({ tts: null, text: t }));
  const totalTokens = [...targetTokens, ...distractors];
  const choices: TranslateChallenge["choices"] = shuffle(totalTokens);
  const correctIndices = targetTokens.map(t =>
    choices.findIndex(c => c.text === t.text),
  );
  const sourceTokens = whitespaceTokenizer(sentence[sourceLanguage]).map(t => ({
    value: t,
    hintTable: getHintTable(hints, t),
  }));
  return {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    prompt: sentence[sourceLanguage],
    choices,
    correctIndices,
    compactTranslations: [sentence[targetLanguage]],
    correctSolutions: [sentence[targetLanguage]],
    correctTokens: totalTokens.map(t => t.text),
    wrongTokens: [],
    type: "translate",
    tokens: sourceTokens,
  };
};

export const forwardTranslateChallengeGenerator = translateChallengeGenerator(
  "xx-TP",
  "en",
);

/** This isn't a very useful challenge type right now
 *  without seeing what they have learned previously
 */
export const reverseTranslateChallengeGenerator = translateChallengeGenerator(
  "en",
  "xx-TP",
);

const getRandomSentence = (
  sentences: Sentence[],
  languageId: string,
  not: string,
) => {
  const viable = sentences.filter(sentence => sentence[languageId] !== not);
  const length = viable.length;
  return viable[Math.floor(Math.random() * length)][languageId];
};

const judgeChallengeGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
) => (sentence: Sentence, distractorSentences: Sentence[]): JudgeChallenge => {
  const choices: JudgeChallenge["choices"] = [1, 2, 3].map(_ =>
    getRandomSentence(
      distractorSentences,
      targetLanguage,
      sentence[targetLanguage],
    ),
  );
  const correctIndex = Math.floor(Math.random() * choices.length);
  choices[correctIndex] = sentence[targetLanguage];
  const correctIndices = [correctIndex];
  return {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    prompt: sentence[sourceLanguage],
    choices,
    correctIndices,
    type: "judge",
  };
};

export const forwardJudgeChallengeGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
) => judgeChallengeGenerator(sourceLanguage, targetLanguage);

export const reverseJudgeChallengeGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
) => judgeChallengeGenerator(targetLanguage, sourceLanguage);
