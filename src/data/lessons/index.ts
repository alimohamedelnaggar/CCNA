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
import { topic26Lesson } from './topic-2-6'
import { topic27Lesson } from './topic-2-7'
import { topic28Lesson } from './topic-2-8'
import { topic29Lesson } from './topic-2-9'
import { topic31Lesson } from './topic-3-1'
import { topic32Lesson } from './topic-3-2'
import { topic33Lesson } from './topic-3-3'
import { topic34Lesson } from './topic-3-4'
import { topic35Lesson } from './topic-3-5'
import { topic41Lesson } from './topic-4-1'
import { topic42Lesson } from './topic-4-2'
import { topic43Lesson } from './topic-4-3'
import { topic44Lesson } from './topic-4-4'
import { topic45Lesson } from './topic-4-5'
import { topic46Lesson } from './topic-4-6'
import { topic47Lesson } from './topic-4-7'
import { topic48Lesson } from './topic-4-8'
import { topic49Lesson } from './topic-4-9'
import { topic51Lesson } from './topic-5-1'
import { topic52Lesson } from './topic-5-2'
import { topic53Lesson } from './topic-5-3'
import { topic54Lesson } from './topic-5-4'
import { topic55Lesson } from './topic-5-5'

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
  '2.6': topic26Lesson,
  '2.7': topic27Lesson,
  '2.8': topic28Lesson,
  '2.9': topic29Lesson,
  '3.1': topic31Lesson,
  '3.2': topic32Lesson,
  '3.3': topic33Lesson,
  '3.4': topic34Lesson,
  '3.5': topic35Lesson,
  '4.1': topic41Lesson,
  '4.2': topic42Lesson,
  '4.3': topic43Lesson,
  '4.4': topic44Lesson,
  '4.5': topic45Lesson,
  '4.6': topic46Lesson,
  '4.7': topic47Lesson,
  '4.8': topic48Lesson,
  '4.9': topic49Lesson,
  '5.1': topic51Lesson,
  '5.2': topic52Lesson,
  '5.3': topic53Lesson,
  '5.4': topic54Lesson,
  '5.5': topic55Lesson,
}

export function getLesson(topicId: string): Lesson | undefined {
  return lessons[topicId]
}
