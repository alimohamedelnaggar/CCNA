import type { Lesson } from '../types'
import { topic11Lesson } from './topic-1-1'
import { topic12Lesson } from './topic-1-2'
import { topic13Lesson } from './topic-1-3'
import { topic14Lesson } from './topic-1-4'

/** Add new finished lessons here. Every topic without an entry gets an honest "coming soon" state. */
export const lessons: Record<string, Lesson> = {
  '1.1': topic11Lesson,
  '1.2': topic12Lesson,
  '1.3': topic13Lesson,
  '1.4': topic14Lesson,
}

export function getLesson(topicId: string): Lesson | undefined {
  return lessons[topicId]
}
