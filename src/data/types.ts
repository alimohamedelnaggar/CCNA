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
  | 'private-public-compare'
  | 'private-rfc1918'
  | 'private-special-ranges'
  | 'private-lan-internet'
  | 'private-static-nat'
  | 'private-dynamic-nat'
  | 'private-pat'
  | 'private-nat-packet'
  | 'private-dora'
  | 'private-dhcp-relay'
  | 'private-lab-topology'
  | 'ipv6-v4-v6-size'
  | 'ipv6-128-structure'
  | 'ipv6-hextets'
  | 'ipv6-hex-binary'
  | 'ipv6-leading-zeros'
  | 'ipv6-zero-compression'
  | 'ipv6-expansion'
  | 'ipv6-prefix-boundary'
  | 'ipv6-gua-lla'
  | 'ipv6-modified-eui64'
  | 'ipv6-lab-topology'
  | 'ipv6-type-delivery'
  | 'ipv6-unicast-categories'
  | 'ipv6-gua-lla-ula'
  | 'ipv6-multicast-structure'
  | 'ipv6-multicast-scope'
  | 'ipv6-multicast-groups'
  | 'ipv6-solicited-node'
  | 'ipv6-ndp-ns-na'
  | 'ipv6-arp-vs-ndp'
  | 'ipv6-anycast-routing'
  | 'ipv6-types-lab-topology'
  | 'client-config-overview'
  | 'windows-ipconfig-compare'
  | 'linux-ip-addr'
  | 'linux-ip-route'
  | 'macos-config-overview'
  | 'default-gateway-path'
  | 'dns-resolution-flow'
  | 'dhcp-lease'
  | 'apipa-troubleshooting'
  | 'connectivity-workflow'
  | 'os-command-compare'
  | 'wireless-overview-signal-path'
  | 'rf-wave-visualization'
  | 'rf-frequency-wavelength'
  | 'wifi-bands-compare'
  | 'wifi-channel-allocation'
  | 'wifi-channel-width'
  | 'wifi-interference-types'
  | 'wifi-signal-attenuation'
  | 'wifi-propagation-effects'
  | 'wifi-rssi-noise-floor'
  | 'wifi-snr-compare'
  | 'wifi-security-evolution'
  | 'wireless-lab-topology'
  | 'wireless-troubleshooting-flow'
  | 'physical-vs-virtual-server'
  | 'multiple-vms-on-host'
  | 'hypervisor-architecture'
  | 'type1-hypervisor-arch'
  | 'type2-hypervisor-arch'
  | 'vm-components'
  | 'container-architecture'
  | 'vm-vs-container'
  | 'vrf-table-separation'
  | 'vrf-overlapping-networks'
  | 'vrf-packet-forwarding'
  | 'hub-vs-switch'
  | 'ethernet-frame-structure'
  | 'mac-address-structure'
  | 'mac-learning-process'
  | 'mac-address-table'
  | 'known-unicast-forwarding'
  | 'unknown-unicast-flooding'
  | 'broadcast-flooding'
  | 'collision-domains'
  | 'broadcast-domains'
  | 'full-half-duplex'
  | 'physical-vs-vlan-segmentation'
  | 'multiple-vlans-one-switch'
  | 'vlans-broadcast-domains'
  | 'department-vlan-segmentation'
  | 'data-vlan-access-port'
  | 'vlan-creation-process'
  | 'port-vlan-assignment'
  | 'ip-phone-data-voice-vlan'
  | 'voice-vlan-traffic-separation'
  | 'vlan1-default-assignment'
  | 'intervlan-router'
  | 'intervlan-layer3-switch'
  | 'two-switches-connected'
  | 'access-vs-trunk-port'
  | 'frame-8021q-tagging'
  | 'dot1q-tag-fields'
  | 'vlan10-crossing-trunk'
  | 'multiple-vlans-one-trunk'
  | 'native-vlan-untagged'
  | 'native-vlan-mismatch'
  | 'allowed-vlan-filtering'
  | 'dtp-negotiation'
  | 'dtp-mode-matrix'
  | 'end-to-end-two-switches'
  | 'directly-connected-devices'
  | 'cdp-advertisement-flow'
  | 'cdp-neighbor-table'
  | 'cdp-timing'
  | 'lldp-advertisement-flow'
  | 'lldp-tlv-structure'
  | 'lldp-neighbor-table'
  | 'lldp-ttl-timeline'
  | 'cdp-vs-lldp'
  | 'multi-vendor-discovery'
  | 'topology-discovery'
  | 'multiple-physical-links'
  | 'etherchannel-port-channel'
  | 'bandwidth-aggregation'
  | 'member-link-failure'
  | 'stp-one-logical-link'
  | 'etherchannel-consistency'
  | 'pagp-auto-desirable'
  | 'lacp-active-passive'
  | 'lacp-negotiation'
  | 'static-mode-on'
  | 'load-balancing-hash'
  | 'l2-vs-l3-etherchannel'
  | 'etherchannel-troubleshooting'
  | 'l2-loop-without-stp'
  | 'broadcast-storm'
  | 'mac-table-instability'
  | 'three-switch-stp-triangle'
  | 'bpdu-exchange'
  | 'bridge-id-structure'
  | 'root-bridge-election'
  | 'root-port-selection'
  | 'designated-port-selection'
  | 'alternate-port-redundant-path'
  | 'classic-stp-port-states'
  | 'rapid-stp-port-states'
  | 'rapid-pvst-per-vlan-topology'
  | 'root-port-failure-activation'
  | 'portfast-bpduguard'

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
