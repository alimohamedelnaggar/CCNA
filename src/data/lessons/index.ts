import type { Lesson } from '../types'
import { topic11Lesson } from './topic-1-1'
import { topic12Lesson } from './topic-1-2'
import { topic13Lesson } from './topic-1-3'
import { topic14Lesson } from './topic-1-4'
import { topic15Lesson } from './topic-1-5'
import { topic16Lesson } from './topic-1-6'
import { topic17Lesson } from './topic-1-7'
import { topic18Lesson } from './topic-1-8'
import { topic19Lesson } from './topic-1-9'
import { topic110Lesson } from './topic-1-10'
import { topic111Lesson } from './topic-1-11'
import { topic112Lesson } from './topic-1-12'
import { topic113Lesson } from './topic-1-13'
import { topic21Lesson } from './topic-2-1'
import { topic22Lesson } from './topic-2-2'
import { topic23Lesson } from './topic-2-3'
import { topic24Lesson } from './topic-2-4'
import { topic25Lesson } from './topic-2-5'

/** Add new finished lessons here. Every topic without an entry gets an honest "coming soon" state. */
export const lessons: Record<string, Lesson> = {
  '1.1': topic11Lesson,
  '1.2': topic12Lesson,
  '1.3': topic13Lesson,
  '1.4': topic14Lesson,
  '1.5': topic15Lesson,
  '1.6': topic16Lesson,
  '1.7': topic17Lesson,
  '1.8': topic18Lesson,
  '1.9': topic19Lesson,
  '1.10': topic110Lesson,
  '1.11': topic111Lesson,
  '1.12': topic112Lesson,
  '1.13': topic113Lesson,
  '2.1': topic21Lesson,
  '2.2': topic22Lesson,
  '2.3': topic23Lesson,
  '2.4': topic24Lesson,
  '2.5': topic25Lesson,
}

export function getLesson(topicId: string): Lesson | undefined {
  return lessons[topicId]
}
