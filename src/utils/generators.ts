import { shuffle } from "underscore";

import { Hints, Sentence } from "../actions";
import { getTokens } from "./hintTable";

const tokenizer = (str: string): string[] =>
  str.split(/[\s,.:!?]/).filter(s => !!s);

const whitespaceTokenizer = (str: string): string[] => str.split(/([\s,.:!?])/);

export interface TranslateChallenge {
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
    hintTable?: string[];
  }[];
}

export interface JudgeChallenge {
  sourceLanguage: string;
  targetLanguage: string;
  prompt: string;
  choices: string[];
  correctIndices: number[];
  type: "judge";
}

export type Challenge = TranslateChallenge | JudgeChallenge;

export type MetaGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  hints: Hints,
  distractorSentences: Sentence[],
) => (sentence: Sentence) => JudgeChallenge | TranslateChallenge;

export interface Token {
  hintTable?: string[];
  value: string;
}

const translateChallengeGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  hints: Hints,
  reverse: boolean,
) => (sentence: Sentence): TranslateChallenge => {
  const forwardSentence = reverse ? sentence.learning : sentence.from;
  const reverseSentence = reverse ? sentence.from : sentence.learning;
  const targetTokens = tokenizer(forwardSentence).map(t => ({
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
  const sourceTokens = whitespaceTokenizer(reverseSentence).map(t => ({
    value: t,
    hintTable: hints[t],
  }));
  return {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    prompt: reverseSentence,
    choices,
    correctIndices,
    compactTranslations: [forwardSentence],
    correctSolutions: [forwardSentence],
    correctTokens: totalTokens.map(t => t.text),
    wrongTokens: [],
    type: "translate",
    tokens: sourceTokens,
  };
};

export const forwardTranslateChallengeGenerator: MetaGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  hints: Hints,
  _: Sentence[],
) => translateChallengeGenerator(targetLanguage, sourceLanguage, hints, false);

/** This isn't a very useful challenge type right now
 *  without seeing what they have learned previously
 */
export const reverseTranslateChallengeGenerator: MetaGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  hints: Hints,
  _: Sentence[],
) => translateChallengeGenerator(sourceLanguage, targetLanguage, hints, true);

const getRandomSentence = (sentences: string[], not: string) => {
  const viable = sentences.filter(sentence => sentence !== not);
  const length = viable.length;
  return viable[Math.floor(Math.random() * length)];
};

const judgeChallengeGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  distractorSentences: Sentence[],
  reverse: boolean,
) => (sentence: Sentence): JudgeChallenge => {
  const forwardSentence = reverse ? sentence.learning : sentence.from;
  const reverseSentence = reverse ? sentence.from : sentence.learning;
  const choices: JudgeChallenge["choices"] = [1, 2, 3].map(_ =>
    getRandomSentence(
      distractorSentences.map(sentence =>
        reverse ? sentence.learning : sentence.from,
      ),
      forwardSentence,
    ),
  );
  const correctIndex = Math.floor(Math.random() * choices.length);
  choices[correctIndex] = forwardSentence;
  const correctIndices = [correctIndex];
  return {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    prompt: reverseSentence,
    choices,
    correctIndices,
    type: "judge",
  };
};

export const forwardJudgeChallengeGenerator: MetaGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  _: Hints,
  distractorSentences: Sentence[],
) =>
  judgeChallengeGenerator(
    sourceLanguage,
    targetLanguage,
    distractorSentences,
    false,
  );

export const reverseJudgeChallengeGenerator: MetaGenerator = (
  sourceLanguage: string,
  targetLanguage: string,
  _: Hints,
  distractorSentences: Sentence[],
) =>
  judgeChallengeGenerator(
    targetLanguage,
    sourceLanguage,
    distractorSentences,
    true,
  );
