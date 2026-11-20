import type { DiagramId, LessonBlock } from '../../data/types'
import {
  SpineLeafDiagram,
  ThreeTierDiagram,
  TopologyLabDiagram,
  TwoTierDiagram,
} from '../diagrams/ArchitectureDiagrams'
import { DeviceMap } from '../diagrams/DeviceMap'
import { EncapsulationDiagram } from '../diagrams/EncapsulationDiagram'
import { FrameDetail } from '../diagrams/FrameDetail'
import { LabTopology } from '../diagrams/LabTopology'
import { PacketFlow } from '../diagrams/PacketFlow'
import {
  ArchitecturePacketJourney,
  CloudOnPremDiagram,
  SohoDiagram,
  WanDiagram,
} from '../diagrams/ScopeDiagrams'
import { CopperFiberDiagram, PhysicalSignalDiagram, UtpStpDiagram, UtpTwistDiagram } from '../diagrams/CopperDiagrams'
import { CsmacdDiagram, HubSharedDiagram, MediaLabDiagram, PointToPointDiagram } from '../diagrams/EthernetDiagrams'
import { FiberCompareDiagram, MmfStructureDiagram, SmfStructureDiagram } from '../diagrams/FiberDiagrams'
import {
  BackoffProcessDiagram,
  CableTroubleshootingFlowDiagram,
  CorruptedFrameDiagram,
  CrcFcsValidationDiagram,
  DuplexMismatchDiagram,
  DuplexModeDiagram,
  EthernetCollisionDiagram,
  HealthyFaultyInterfaceDiagram,
  InterfaceCountersDashboard,
  SpeedNegotiationDiagram,
} from '../diagrams/InterfaceIssueDiagrams'
import { Callout } from './Callout'
import { CodeBlock } from './CodeBlock'
import { DataTable } from './DataTable'
import { QuizCard } from './QuizCard'
import { RichText } from './RichText'
import { StepByStep } from './StepByStep'

function Diagram({ id }: { id: DiagramId }) {
  switch (id) {
    case 'device-map':
      return <DeviceMap />
    case 'packet-flow':
      return <PacketFlow />
    case 'encapsulation':
      return <EncapsulationDiagram />
    case 'frame-detail':
      return <FrameDetail />
    case 'lab-topology':
      return <LabTopology />
    case 'topology-two-tier':
      return <TwoTierDiagram />
    case 'topology-three-tier':
      return <ThreeTierDiagram />
    case 'topology-spine-leaf':
      return <SpineLeafDiagram />
    case 'topology-wan':
      return <WanDiagram />
    case 'topology-soho':
      return <SohoDiagram />
    case 'topology-cloud':
      return <CloudOnPremDiagram />
    case 'topology-journey':
      return <ArchitecturePacketJourney />
    case 'topology-lab':
      return <TopologyLabDiagram />
    case 'media-smf':
      return <SmfStructureDiagram />
    case 'media-mmf':
      return <MmfStructureDiagram />
    case 'media-fiber-compare':
      return <FiberCompareDiagram />
    case 'media-utp-twist':
      return <UtpTwistDiagram />
    case 'media-utp-stp':
      return <UtpStpDiagram />
    case 'media-copper-fiber':
      return <CopperFiberDiagram />
    case 'media-hub':
      return <HubSharedDiagram />
    case 'media-csmacd':
      return <CsmacdDiagram />
    case 'media-p2p':
      return <PointToPointDiagram />
    case 'media-signal':
      return <PhysicalSignalDiagram />
    case 'media-lab':
      return <MediaLabDiagram />
    case 'issue-collision':
      return <EthernetCollisionDiagram />
    case 'issue-backoff':
      return <BackoffProcessDiagram />
    case 'issue-crc':
      return <CrcFcsValidationDiagram />
    case 'issue-corrupt-frame':
      return <CorruptedFrameDiagram />
    case 'issue-duplex-modes':
      return <DuplexModeDiagram />
    case 'issue-duplex-mismatch':
      return <DuplexMismatchDiagram />
    case 'issue-speed-neg':
      return <SpeedNegotiationDiagram />
    case 'issue-interface-state':
      return <HealthyFaultyInterfaceDiagram />
    case 'issue-counters':
      return <InterfaceCountersDashboard />
    case 'issue-cable-flow':
      return <CableTroubleshootingFlowDiagram />
  }
}

export function LessonBlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          <RichText>{block.text}</RichText>
        </p>
      )
    case 'list':
      return block.ordered ? (
        <ol>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText>{item}</RichText>
            </li>
          ))}
        </ol>
      ) : (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText>{item}</RichText>
            </li>
          ))}
        </ul>
      )
    case 'code':
      return <CodeBlock label={block.label} code={block.code} />
    case 'table':
      return <DataTable headers={block.headers} rows={block.rows} />
    case 'callout':
      return <Callout tone={block.tone} title={block.title} text={block.text} />
    case 'diagram':
      return (
        <figure>
          <Diagram id={block.id} />
          {block.caption && (
            <figcaption className="my-3 text-center text-[0.82rem] text-slate-500">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'steps':
      return <StepByStep items={block.items} />
    case 'quiz':
      return (
        <div>
          {block.questions.map((question, index) => (
            <QuizCard key={question.id} question={question} number={index + 1} />
          ))}
        </div>
      )
  }
}
