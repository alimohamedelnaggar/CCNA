export type DiagramId =
  | 'device-map'
  | 'packet-flow'
  | 'encapsulation'
  | 'frame-detail'
  | 'lab-topology'
  | 'topology-two-tier'
  | 'topology-three-tier'
  | 'topology-spine-leaf'
  | 'topology-wan'
  | 'topology-soho'
  | 'topology-cloud'
  | 'topology-journey'
  | 'topology-lab'
  | 'media-smf'
  | 'media-mmf'
  | 'media-fiber-compare'
  | 'media-utp-twist'
  | 'media-utp-stp'
  | 'media-copper-fiber'
  | 'media-hub'
  | 'media-csmacd'
  | 'media-p2p'
  | 'media-signal'
  | 'media-lab'
  | 'issue-collision'
  | 'issue-backoff'
  | 'issue-crc'
  | 'issue-corrupt-frame'
  | 'issue-duplex-modes'
  | 'issue-duplex-mismatch'
  | 'issue-speed-neg'
  | 'issue-interface-state'
  | 'issue-counters'
  | 'issue-cable-flow'
  | 'transport-tcp-udp'
  | 'transport-tcp-header'
  | 'transport-udp-header'
  | 'transport-handshake'
  | 'transport-termination'
  | 'transport-flags'
  | 'transport-seq-ack'
  | 'transport-retransmission'
  | 'transport-sliding-window'
  | 'transport-port-flow'
  | 'ipv4-32bit'
  | 'ipv4-binary-conversion'
  | 'ipv4-network-host'
  | 'ipv4-subnet-mask-cidr'
  | 'ipv4-range'
  | 'ipv4-subnet-26'
  | 'ipv4-block-size'
  | 'ipv4-flsm-vlsm'
  | 'ipv4-vlsm-allocation'
  | 'ipv4-lab-topology'

export type CalloutTone = 'info' | 'tip' | 'warning' | 'danger'

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  /** Single-answer questions use correctIndex. Multi-select questions use correctIndices. */
  correctIndex?: number
  correctIndices?: number[]
  explanation: string
  /** Defaults to single choice with immediate feedback, which keeps older lessons unchanged. */
  kind?: 'single' | 'multiple'
  /** When true, feedback stays hidden until the student presses the submit button. */
  requireSubmit?: boolean
  diagram?: 'hybrid-cloud'
}

export type LessonBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'code'; label: string; language?: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; tone: CalloutTone; title: string; text: string }
  | { type: 'diagram'; id: DiagramId; caption?: string }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'quiz'; questions: QuizQuestion[] }

export type StepId =
  | 'what'
  | 'how'
  | 'packet'
  | 'config'
  | 'verify'
  | 'mistakes'
  | 'lab'
  | 'exam'
  | 'summary'

export interface LessonStep {
  id: StepId
  title: string
  short: string
  blocks: LessonBlock[]
}

export interface Lesson {
  topicId: string
  title: string
  description: string
  estimatedTime: string
  steps: LessonStep[]
}

export interface CurriculumTopic {
  id: string
  titleAr: string
  titleEn: string
  objectives: { code: string; text: string }[]
}

export interface CurriculumDomain {
  id: string
  titleAr: string
  titleEn: string
  weight: number
  description: string
  accent: string
  topics: CurriculumTopic[]
}
