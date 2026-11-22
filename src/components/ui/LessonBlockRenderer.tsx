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
import {
  TcpFlagsDiagram,
  TcpHandshakeDiagram,
  TcpRetransmissionDiagram,
  TcpSegmentHeaderDiagram,
  TcpSequenceAckDiagram,
  TcpSlidingWindowDiagram,
  TcpTerminationDiagram,
  TcpUdpCommunicationDiagram,
  TcpUdpPortDiagram,
  UdpDatagramHeaderDiagram,
} from '../diagrams/TransportDiagrams'
import {
  BinaryConversionDiagram,
  BlockSizeDiagram,
  FlsmVlsmDiagram,
  IpRangeDiagram,
  Ipv4LabTopologyDiagram,
  Ipv4StructureDiagram,
  NetworkHostDiagram,
  Subnet26Diagram,
  SubnetMaskCidrDiagram,
  VlsmAllocationDiagram,
} from '../diagrams/Ipv4Diagrams'
import {
  DoraDiagram,
  DhcpRelayDiagram,
  DynamicNatDiagram,
  LanToInternetDiagram,
  NatPacketDiagram,
  PatDiagram,
  PrivateLabTopologyDiagram,
  PublicVsPrivateDiagram,
  Rfc1918RangesDiagram,
  SpecialRangesDiagram,
  StaticNatDiagram,
} from '../diagrams/PrivateIpv4Diagrams'
import {
  Ipv4VsIpv6SizeDiagram,
  Ipv6StructureDiagram,
  Ipv6HextetsDiagram,
  Ipv6HexBinaryDiagram,
  Ipv6LeadingZerosDiagram,
  Ipv6ZeroCompressionDiagram,
  Ipv6ExpansionDiagram,
  Ipv6PrefixBoundaryDiagram,
  Ipv6GuaVsLlaDiagram,
  Ipv6ModifiedEui64Diagram,
  Ipv6LabTopologyDiagram,
} from '../diagrams/Ipv6AddressingDiagrams'
import {
  Ipv6DeliveryTypesDiagram,
  Ipv6UnicastCategoriesDiagram,
  Ipv6GuaLlaUlaDiagram,
  Ipv6MulticastStructureDiagram,
  Ipv6MulticastScopeDiagram,
  Ipv6MulticastGroupsDiagram,
  Ipv6SolicitedNodeDiagram,
  Ipv6NdpNsNaDiagram,
  Ipv6ArpVsNdpDiagram,
  Ipv6AnycastRoutingDiagram,
  Ipv6TypesLabTopologyDiagram,
} from '../diagrams/Ipv6AddressTypesDiagrams'
import {
  ClientConfigOverviewDiagram,
  WindowsIpconfigCompareDiagram,
  LinuxIpAddrDiagram,
  LinuxIpRouteDiagram,
  MacOsConfigOverviewDiagram,
  DefaultGatewayPathDiagram,
  DnsResolutionFlowDiagram,
  DhcpLeaseDiagram,
  ApipaTroubleshootingDiagram,
  ConnectivityWorkflowDiagram,
  OsCommandCompareDiagram,
} from '../diagrams/ClientIpVerificationDiagrams'
import {
  WirelessOverviewDiagram,
  RfWaveVisualizationDiagram,
  FrequencyWavelengthDiagram,
  WirelessBandsCompareDiagram,
  WifiChannelAllocationDiagram,
  ChannelWidthCompareDiagram,
  CochannelAdjacentInterferenceDiagram,
  SignalAttenuationWallsDiagram,
  WavePropagationEffectsDiagram,
  RssiNoiseFloorDiagram,
  SnrCompareDiagram,
  WirelessSecurityEvolutionDiagram,
  WirelessLabTopologyDiagram,
  WirelessTroubleshootingFlowDiagram,
} from '../diagrams/WirelessPrinciplesDiagrams'
import {
  PhysicalVsVirtualServerDiagram,
  MultipleVmsOnHostDiagram,
  HypervisorArchitectureDiagram,
  Type1HypervisorDiagram,
  Type2HypervisorDiagram,
  VmComponentsDiagram,
  ContainerArchitectureDiagram,
  VmVsContainerDiagram,
  VrfRoutingTableSeparationDiagram,
  VrfOverlappingNetworksDiagram,
  VrfPacketForwardingDiagram,
} from '../diagrams/VirtualizationFundamentalsDiagrams'
import {
  HubVsSwitchDiagram,
  EthernetFrameStructureDiagram,
  MacAddressStructureDiagram,
  MacLearningProcessDiagram,
  MacAddressTableDiagram,
  KnownUnicastForwardingDiagram,
  UnknownUnicastFloodingDiagram,
  BroadcastFloodingDiagram,
  CollisionDomainsDiagram,
  BroadcastDomainsDiagram,
  DuplexModesDiagram,
} from '../diagrams/SwitchingConceptsDiagrams'
import {
  PhysicalVsVlanSegmentationDiagram,
  MultipleVlansOneSwitchDiagram,
  VlansBroadcastDomainsDiagram,
  DepartmentVlanSegmentationDiagram,
  DataVlanAccessPortDiagram,
  VlanCreationProcessDiagram,
  PortVlanAssignmentDiagram,
  IpPhoneDataVoiceDiagram,
  VoiceVlanTrafficSeparationDiagram,
  Vlan1DefaultAssignmentDiagram,
  InterVlanRouterDiagram,
  InterVlanL3SwitchDiagram,
} from '../diagrams/VlansDiagrams'
import {
  AccessVsTrunkPortDiagram,
  AllowedVlanFilteringDiagram,
  Dot1qTagFieldsDiagram,
  DtpModeMatrixDiagram,
  DtpNegotiationDiagram,
  EndToEndTwoSwitchesDiagram,
  Frame8021qTaggingDiagram,
  MultipleVlansOneTrunkDiagram,
  NativeVlanMismatchDiagram,
  NativeVlanUntaggedDiagram,
  TwoSwitchesConnectedDiagram,
  Vlan10CrossingTrunkDiagram,
} from '../diagrams/TrunkingDiagrams'
import {
  CdpAdvertisementFlowDiagram,
  CdpNeighborTableDiagram,
  CdpTimingDiagram,
  CdpVsLldpComparisonDiagram,
  DirectlyConnectedDevicesDiagram,
  LldpAdvertisementFlowDiagram,
  LldpNeighborTableDiagram,
  LldpTlvStructureDiagram,
  LldpTtlTimelineDiagram,
  MultiVendorDiscoveryDiagram,
  TopologyDiscoveryDiagram,
} from '../diagrams/DiscoveryProtocolsDiagrams'
import {
  BandwidthAggregationDiagram,
  ConsistencyDiagram,
  EtherchannelTroubleshootingDiagram,
  LacpActivePassiveDiagram,
  LacpNegotiationDiagram,
  L2VsL3EtherChannelDiagram,
  LoadBalancingHashDiagram,
  MemberLinkFailureDiagram,
  MultiplePhysicalLinksDiagram,
  PagpAutoDesirableDiagram,
  PortChannelDiagram,
  StaticModeOnDiagram,
  StpOneLogicalLinkDiagram,
} from '../diagrams/EtherChannelDiagrams'
import {
  AlternatePortDiagram,
  BpduExchangeDiagram,
  BroadcastStormDiagram,
  BridgeIdStructureDiagram,
  ClassicStpStatesDiagram,
  DesignatedPortSelectionDiagram,
  LayerTwoLoopDiagram,
  MacTableInstabilityDiagram,
  PortFastBpduGuardDiagram,
  RapidPvstPerVlanDiagram,
  RapidStpStatesDiagram,
  RootBridgeElectionDiagram,
  RootPortFailureDiagram,
  RootPortSelectionDiagram,
  ThreeSwitchStpTriangleDiagram,
} from '../diagrams/SpanningTreeDiagrams'
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
    case 'transport-tcp-udp':
      return <TcpUdpCommunicationDiagram />
    case 'transport-tcp-header':
      return <TcpSegmentHeaderDiagram />
    case 'transport-udp-header':
      return <UdpDatagramHeaderDiagram />
    case 'transport-handshake':
      return <TcpHandshakeDiagram />
    case 'transport-termination':
      return <TcpTerminationDiagram />
    case 'transport-flags':
      return <TcpFlagsDiagram />
    case 'transport-seq-ack':
      return <TcpSequenceAckDiagram />
    case 'transport-retransmission':
      return <TcpRetransmissionDiagram />
    case 'transport-sliding-window':
      return <TcpSlidingWindowDiagram />
    case 'transport-port-flow':
      return <TcpUdpPortDiagram />
    case 'ipv4-32bit':
      return <Ipv4StructureDiagram />
    case 'ipv4-binary-conversion':
      return <BinaryConversionDiagram />
    case 'ipv4-network-host':
      return <NetworkHostDiagram />
    case 'ipv4-subnet-mask-cidr':
      return <SubnetMaskCidrDiagram />
    case 'ipv4-range':
      return <IpRangeDiagram />
    case 'ipv4-subnet-26':
      return <Subnet26Diagram />
    case 'ipv4-block-size':
      return <BlockSizeDiagram />
    case 'ipv4-flsm-vlsm':
      return <FlsmVlsmDiagram />
    case 'ipv4-vlsm-allocation':
      return <VlsmAllocationDiagram />
    case 'ipv4-lab-topology':
      return <Ipv4LabTopologyDiagram />
    case 'private-public-compare':
      return <PublicVsPrivateDiagram />
    case 'private-rfc1918':
      return <Rfc1918RangesDiagram />
    case 'private-special-ranges':
      return <SpecialRangesDiagram />
    case 'private-lan-internet':
      return <LanToInternetDiagram />
    case 'private-static-nat':
      return <StaticNatDiagram />
    case 'private-dynamic-nat':
      return <DynamicNatDiagram />
    case 'private-pat':
      return <PatDiagram />
    case 'private-nat-packet':
      return <NatPacketDiagram />
    case 'private-dora':
      return <DoraDiagram />
    case 'private-dhcp-relay':
      return <DhcpRelayDiagram />
    case 'private-lab-topology':
      return <PrivateLabTopologyDiagram />
    case 'ipv6-v4-v6-size':
      return <Ipv4VsIpv6SizeDiagram />
    case 'ipv6-128-structure':
      return <Ipv6StructureDiagram />
    case 'ipv6-hextets':
      return <Ipv6HextetsDiagram />
    case 'ipv6-hex-binary':
      return <Ipv6HexBinaryDiagram />
    case 'ipv6-leading-zeros':
      return <Ipv6LeadingZerosDiagram />
    case 'ipv6-zero-compression':
      return <Ipv6ZeroCompressionDiagram />
    case 'ipv6-expansion':
      return <Ipv6ExpansionDiagram />
    case 'ipv6-prefix-boundary':
      return <Ipv6PrefixBoundaryDiagram />
    case 'ipv6-gua-lla':
      return <Ipv6GuaVsLlaDiagram />
    case 'ipv6-modified-eui64':
      return <Ipv6ModifiedEui64Diagram />
    case 'ipv6-lab-topology':
      return <Ipv6LabTopologyDiagram />
    case 'ipv6-type-delivery':
      return <Ipv6DeliveryTypesDiagram />
    case 'ipv6-unicast-categories':
      return <Ipv6UnicastCategoriesDiagram />
    case 'ipv6-gua-lla-ula':
      return <Ipv6GuaLlaUlaDiagram />
    case 'ipv6-multicast-structure':
      return <Ipv6MulticastStructureDiagram />
    case 'ipv6-multicast-scope':
      return <Ipv6MulticastScopeDiagram />
    case 'ipv6-multicast-groups':
      return <Ipv6MulticastGroupsDiagram />
    case 'ipv6-solicited-node':
      return <Ipv6SolicitedNodeDiagram />
    case 'ipv6-ndp-ns-na':
      return <Ipv6NdpNsNaDiagram />
    case 'ipv6-arp-vs-ndp':
      return <Ipv6ArpVsNdpDiagram />
    case 'ipv6-anycast-routing':
      return <Ipv6AnycastRoutingDiagram />
    case 'ipv6-types-lab-topology':
      return <Ipv6TypesLabTopologyDiagram />
    case 'client-config-overview':
      return <ClientConfigOverviewDiagram />
    case 'windows-ipconfig-compare':
      return <WindowsIpconfigCompareDiagram />
    case 'linux-ip-addr':
      return <LinuxIpAddrDiagram />
    case 'linux-ip-route':
      return <LinuxIpRouteDiagram />
    case 'macos-config-overview':
      return <MacOsConfigOverviewDiagram />
    case 'default-gateway-path':
      return <DefaultGatewayPathDiagram />
    case 'dns-resolution-flow':
      return <DnsResolutionFlowDiagram />
    case 'dhcp-lease':
      return <DhcpLeaseDiagram />
    case 'apipa-troubleshooting':
      return <ApipaTroubleshootingDiagram />
    case 'connectivity-workflow':
      return <ConnectivityWorkflowDiagram />
    case 'os-command-compare':
      return <OsCommandCompareDiagram />
    case 'wireless-overview-signal-path':
      return <WirelessOverviewDiagram />
    case 'rf-wave-visualization':
      return <RfWaveVisualizationDiagram />
    case 'rf-frequency-wavelength':
      return <FrequencyWavelengthDiagram />
    case 'wifi-bands-compare':
      return <WirelessBandsCompareDiagram />
    case 'wifi-channel-allocation':
      return <WifiChannelAllocationDiagram />
    case 'wifi-channel-width':
      return <ChannelWidthCompareDiagram />
    case 'wifi-interference-types':
      return <CochannelAdjacentInterferenceDiagram />
    case 'wifi-signal-attenuation':
      return <SignalAttenuationWallsDiagram />
    case 'wifi-propagation-effects':
      return <WavePropagationEffectsDiagram />
    case 'wifi-rssi-noise-floor':
      return <RssiNoiseFloorDiagram />
    case 'wifi-snr-compare':
      return <SnrCompareDiagram />
    case 'wifi-security-evolution':
      return <WirelessSecurityEvolutionDiagram />
    case 'wireless-lab-topology':
      return <WirelessLabTopologyDiagram />
    case 'wireless-troubleshooting-flow':
      return <WirelessTroubleshootingFlowDiagram />
    case 'physical-vs-virtual-server':
      return <PhysicalVsVirtualServerDiagram />
    case 'multiple-vms-on-host':
      return <MultipleVmsOnHostDiagram />
    case 'hypervisor-architecture':
      return <HypervisorArchitectureDiagram />
    case 'type1-hypervisor-arch':
      return <Type1HypervisorDiagram />
    case 'type2-hypervisor-arch':
      return <Type2HypervisorDiagram />
    case 'vm-components':
      return <VmComponentsDiagram />
    case 'container-architecture':
      return <ContainerArchitectureDiagram />
    case 'vm-vs-container':
      return <VmVsContainerDiagram />
    case 'vrf-table-separation':
      return <VrfRoutingTableSeparationDiagram />
    case 'vrf-overlapping-networks':
      return <VrfOverlappingNetworksDiagram />
    case 'vrf-packet-forwarding':
      return <VrfPacketForwardingDiagram />
    case 'hub-vs-switch':
      return <HubVsSwitchDiagram />
    case 'ethernet-frame-structure':
      return <EthernetFrameStructureDiagram />
    case 'mac-address-structure':
      return <MacAddressStructureDiagram />
    case 'mac-learning-process':
      return <MacLearningProcessDiagram />
    case 'mac-address-table':
      return <MacAddressTableDiagram />
    case 'known-unicast-forwarding':
      return <KnownUnicastForwardingDiagram />
    case 'unknown-unicast-flooding':
      return <UnknownUnicastFloodingDiagram />
    case 'broadcast-flooding':
      return <BroadcastFloodingDiagram />
    case 'collision-domains':
      return <CollisionDomainsDiagram />
    case 'broadcast-domains':
      return <BroadcastDomainsDiagram />
    case 'full-half-duplex':
      return <DuplexModesDiagram />
    case 'physical-vs-vlan-segmentation':
      return <PhysicalVsVlanSegmentationDiagram />
    case 'multiple-vlans-one-switch':
      return <MultipleVlansOneSwitchDiagram />
    case 'vlans-broadcast-domains':
      return <VlansBroadcastDomainsDiagram />
    case 'department-vlan-segmentation':
      return <DepartmentVlanSegmentationDiagram />
    case 'data-vlan-access-port':
      return <DataVlanAccessPortDiagram />
    case 'vlan-creation-process':
      return <VlanCreationProcessDiagram />
    case 'port-vlan-assignment':
      return <PortVlanAssignmentDiagram />
    case 'ip-phone-data-voice-vlan':
      return <IpPhoneDataVoiceDiagram />
    case 'voice-vlan-traffic-separation':
      return <VoiceVlanTrafficSeparationDiagram />
    case 'vlan1-default-assignment':
      return <Vlan1DefaultAssignmentDiagram />
    case 'intervlan-router':
      return <InterVlanRouterDiagram />
    case 'intervlan-layer3-switch':
      return <InterVlanL3SwitchDiagram />
    case 'two-switches-connected':
      return <TwoSwitchesConnectedDiagram />
    case 'access-vs-trunk-port':
      return <AccessVsTrunkPortDiagram />
    case 'frame-8021q-tagging':
      return <Frame8021qTaggingDiagram />
    case 'dot1q-tag-fields':
      return <Dot1qTagFieldsDiagram />
    case 'vlan10-crossing-trunk':
      return <Vlan10CrossingTrunkDiagram />
    case 'multiple-vlans-one-trunk':
      return <MultipleVlansOneTrunkDiagram />
    case 'native-vlan-untagged':
      return <NativeVlanUntaggedDiagram />
    case 'native-vlan-mismatch':
      return <NativeVlanMismatchDiagram />
    case 'allowed-vlan-filtering':
      return <AllowedVlanFilteringDiagram />
    case 'dtp-negotiation':
      return <DtpNegotiationDiagram />
    case 'dtp-mode-matrix':
      return <DtpModeMatrixDiagram />
    case 'end-to-end-two-switches':
      return <EndToEndTwoSwitchesDiagram />
    case 'directly-connected-devices':
      return <DirectlyConnectedDevicesDiagram />
    case 'cdp-advertisement-flow':
      return <CdpAdvertisementFlowDiagram />
    case 'cdp-neighbor-table':
      return <CdpNeighborTableDiagram />
    case 'cdp-timing':
      return <CdpTimingDiagram />
    case 'lldp-advertisement-flow':
      return <LldpAdvertisementFlowDiagram />
    case 'lldp-tlv-structure':
      return <LldpTlvStructureDiagram />
    case 'lldp-neighbor-table':
      return <LldpNeighborTableDiagram />
    case 'lldp-ttl-timeline':
      return <LldpTtlTimelineDiagram />
    case 'cdp-vs-lldp':
      return <CdpVsLldpComparisonDiagram />
    case 'multi-vendor-discovery':
      return <MultiVendorDiscoveryDiagram />
    case 'topology-discovery':
      return <TopologyDiscoveryDiagram />
    case 'multiple-physical-links':
      return <MultiplePhysicalLinksDiagram />
    case 'etherchannel-port-channel':
      return <PortChannelDiagram />
    case 'bandwidth-aggregation':
      return <BandwidthAggregationDiagram />
    case 'member-link-failure':
      return <MemberLinkFailureDiagram />
    case 'stp-one-logical-link':
      return <StpOneLogicalLinkDiagram />
    case 'etherchannel-consistency':
      return <ConsistencyDiagram />
    case 'pagp-auto-desirable':
      return <PagpAutoDesirableDiagram />
    case 'lacp-active-passive':
      return <LacpActivePassiveDiagram />
    case 'lacp-negotiation':
      return <LacpNegotiationDiagram />
    case 'static-mode-on':
      return <StaticModeOnDiagram />
    case 'load-balancing-hash':
      return <LoadBalancingHashDiagram />
    case 'l2-vs-l3-etherchannel':
      return <L2VsL3EtherChannelDiagram />
    case 'etherchannel-troubleshooting':
      return <EtherchannelTroubleshootingDiagram />
    case 'l2-loop-without-stp':
      return <LayerTwoLoopDiagram />
    case 'broadcast-storm':
      return <BroadcastStormDiagram />
    case 'mac-table-instability':
      return <MacTableInstabilityDiagram />
    case 'three-switch-stp-triangle':
      return <ThreeSwitchStpTriangleDiagram />
    case 'bpdu-exchange':
      return <BpduExchangeDiagram />
    case 'bridge-id-structure':
      return <BridgeIdStructureDiagram />
    case 'root-bridge-election':
      return <RootBridgeElectionDiagram />
    case 'root-port-selection':
      return <RootPortSelectionDiagram />
    case 'designated-port-selection':
      return <DesignatedPortSelectionDiagram />
    case 'alternate-port-redundant-path':
      return <AlternatePortDiagram />
    case 'classic-stp-port-states':
      return <ClassicStpStatesDiagram />
    case 'rapid-stp-port-states':
      return <RapidStpStatesDiagram />
    case 'rapid-pvst-per-vlan-topology':
      return <RapidPvstPerVlanDiagram />
    case 'root-port-failure-activation':
      return <RootPortFailureDiagram />
    case 'portfast-bpduguard':
      return <PortFastBpduGuardDiagram />
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
