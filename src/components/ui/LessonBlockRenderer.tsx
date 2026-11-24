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
import {
  ApModesComparisonDiagram,
  AutonomousApArchitectureDiagram,
  BasicWlanArchitectureDiagram,
  CapwapControlVsDataDiagram,
  CapwapDiscoveryDiagram,
  CapwapJoinDiagram,
  CentralizedWirelessDeploymentDiagram,
  CloudBasedWirelessDiagram,
  EmbeddedWirelessControllerDiagram,
  FlexConnectSwitchingDiagram,
  LightweightApWlcDiagram,
  LocalModeApDiagram,
  MonitorVsSnifferDiagram,
  RogueDetectorModeDiagram,
  WirelessBridgeModeDiagram,
} from '../diagrams/CiscoWirelessDiagrams'
import {
  ApAccessPortDiagram,
  ApToAccessSwitchConnectionDiagram,
  ApToWlcCapwapPhysicalPathDiagram,
  ApTrunkPortDiagram,
  EnterpriseWlanPhysicalTopologyDiagram,
  MultipleWlanVlansAcrossApUplinkDiagram,
  PhysicalLinkFailureRedundancyDiagram,
  PoeInjectorVsPoeSwitchDiagram,
  PoePowerBudgetDiagram,
  PoePowerDeliveryDiagram,
  SwitchPortChannelToWlcDiagram,
  WlcLagArchitectureDiagram,
  WlcPhysicalConnectivityDiagram,
  WlcPhysicalVsLogicalInterfacesDiagram,
} from '../diagrams/WlanPhysicalInfrastructureDiagrams'
import {
  AaaAuthenticationFlowDiagram,
  AaaAuthnAuthzAcctDiagram,
  AuxModemAccessDiagram,
  CliVsWebGuiManagementDiagram,
  ConsoleConnectionDiagram,
  HttpVsHttpsManagementDiagram,
  InBandManagementPathDiagram,
  LocalVsCentralizedAuthenticationDiagram,
  NetworkDeviceManagementOverviewDiagram,
  OutOfBandManagementPathDiagram,
  RadiusArchitectureDiagram,
  SshEncryptedCommunicationDiagram,
  TacacsPlusArchitectureDiagram,
  TacacsVsRadiusComparisonDiagram,
  TelnetPlaintextCommunicationDiagram,
} from '../diagrams/NetworkManagementDiagrams'
import {
  CommonWlanConfigurationFailuresDiagram,
  CompleteWlanConfigVerificationWorkflowDiagram,
  DhcpAfterAssociationDiagram,
  EnterpriseWlanArchitectureDiagram,
  MultipleWlansVlansDiagram,
  WlanProfileVsSsidDiagram,
  WlanToVlanMappingDiagram,
  WirelessClientAssociationDiagram,
  WirelessClientSsidDiscoveryDiagram,
  WirelessClientTrafficThroughWlcDiagram,
  WlcGuiConfigurationWorkflowDiagram,
  Wpa2AuthenticationFlowDiagram,
  Wpa2PskSecurityArchitectureDiagram,
} from '../diagrams/WlanGuiConfigurationDiagrams'
import {
  AdministrativeDistanceComparisonDiagram,
  AdVsMetricDiagram,
  CompleteRoutingTableExampleDiagram,
  ConnectedRouteDiagram,
  DynamicRouteDiagram,
  ExitInterfaceDiagram,
  GatewayOfLastResortDiagram,
  LocalRouteDiagram,
  MetricComparisonDiagram,
  NextHopDiagram,
  PrefixAndNetworkMaskDiagram,
  RouteCodesDiagram,
  RoutingTableConceptDiagram,
  RoutingTableEntryAnatomyDiagram,
  StaticRouteDiagram,
} from '../diagrams/RoutingTableDiagrams'
import {
  AdMetricDecisionProcessDiagram,
  AdRouteSourceComparisonDiagram,
  ArpNextHopResolutionDiagram,
  BestRouteSelectionFlowchartDiagram,
  BinaryPrefixMatchingDiagram,
  CompleteRoutingDecisionScenarioDiagram,
  ControlPlaneVsDataPlaneDiagram,
  DefaultRouteGatewayLastResortDiagram,
  Layer2ReencapsulationDiagram,
  LongestPrefixMatchConceptDiagram,
  MultiplePrefixComparisonDiagram,
  PacketForwardingLifecycleDiagram,
  RouterHopByHopForwardingDiagram,
  RoutingProtocolMetricsComparisonDiagram,
  RoutingVsForwardingDiagram,
} from '../diagrams/RoutingDecisionsDiagrams'
import {
  CompleteStaticRoutingFlowDiagram,
  DefaultStaticRouteDiagram,
  DirectlyConnectedStaticRouteDiagram,
  FloatingStaticRouteDiagram,
  HostStaticRouteDiagram,
  Ipv4StaticRoutingTopologyDiagram,
  Ipv6LinkLocalNextHopDiagram,
  Ipv6StaticRoutingTopologyDiagram,
  NetworkStaticRouteDiagram,
  NextHopVsExitInterfaceDiagram,
  PrimaryVsBackupPathDiagram,
  RecursiveStaticRouteDiagram,
  RoutingTableBeforeAfterStaticDiagram,
  StaticRoutingConceptDiagram,
  StaticVsDynamicRoutingDiagram,
} from '../diagrams/StaticRoutingDiagrams'
import {
  BroadcastMultiaccessOspfDiagram,
  DrBdrElectionDiagram,
  DynamicVsStaticRoutingDiagram,
  HelloAndDeadIntervalsDiagram,
  HelloPacketExchangeDiagram,
  LinkStateDatabaseDiagram,
  NeighborVsFullAdjacencyDiagram,
  OspfArchitectureOverviewDiagram,
  OspfBestPathSelectionDiagram,
  OspfConfigurationFlowDiagram,
  OspfCostCalculationDiagram,
  OspfNeighborStatesDiagram,
  OspfOperationLifecycleDiagram,
  OspfTroubleshootingFlowDiagram,
  PointToPointOspfDiagram,
  RouterIdSelectionDiagram,
  SingleAreaOspfTopologyDiagram,
  SpfAlgorithmDiagram,
} from '../diagrams/OspfDiagrams'
import {
  CompleteGatewayRedundancyTopologyDiagram,
  FhrpOperationDiagram,
  GatewayRedundancyConceptDiagram,
  HsrpActiveStandbyDiagram,
  HsrpFailoverTimelineDiagram,
  HsrpHelloHoldTimersDiagram,
  HsrpPreemptionDiagram,
  HsrpPriorityElectionDiagram,
  HsrpStateMachineDiagram,
  HsrpVsVrrpComparisonDiagram,
  InterfaceTrackingDiagram,
  PhysicalVsVirtualIpDiagram,
  SingleGatewayFailureDiagram,
  VirtualMacAddressDiagram,
  VrrpMasterBackupDiagram,
} from '../diagrams/FhrpDiagrams'
import {
  DynamicNatMappingDiagram,
  NatBeforeAfterTranslationDiagram,
  NatConceptDiagram,
  NatConfigurationTopologyDiagram,
  NatInsideLocalGlobalDiagram,
  NatOutsideLocalGlobalDiagram,
  NatPacketFlowDiagram,
  NatPoolDiagram,
  NatPortTranslationDiagram,
  NatPrivateVsPublicIpDiagram,
  NatTerminologyCompleteDiagram,
  NatTranslationTableDiagram,
  NatTroubleshootingFlowDiagram,
  NatTypesComparisonDiagram,
  PatNatOverloadDiagram,
  StaticNatMappingDiagram,
} from '../diagrams/NatDiagrams'
import {
  ClockSynchronizationDiagram,
  NtpAssociationStatesDiagram,
  NtpClientConfigurationDiagram,
  NtpClientVsServerDiagram,
  NtpConceptDiagram,
  NtpNetworkTopologyDiagram,
  NtpRequestResponseDiagram,
  NtpServerConfigurationDiagram,
  NtpSynchronizationLifecycleDiagram,
  NtpTroubleshootingFlowDiagram,
  Stratum0Vs1Diagram,
  Stratum16UnsynchronizedDiagram,
  Stratum2To15Diagram,
  StratumHierarchyDiagram,
  UtcVsLocalTimeZoneDiagram,
} from '../diagrams/NtpDiagrams'
import {
  CompleteConnectionLifecycleDiagram,
  DhcpAckPacketDiagram,
  DhcpClientServerDiagram,
  DhcpConceptDiagram,
  DhcpDnsInteractionDiagram,
  DhcpDnsTroubleshootingFlowDiagram,
  DhcpDiscoverPacketDiagram,
  DhcpLeaseLifecycleDiagram,
  DhcpOfferPacketDiagram,
  DhcpPacketFieldsDiagram,
  DhcpRequestPacketDiagram,
  DnsCacheDiagram,
  DnsHierarchyDiagram,
  DnsRecordTypesDiagram,
  DnsResolutionOverviewDiagram,
  DoraProcessDiagram,
  ForwardVsReverseLookupDiagram,
  RecursiveVsIterativeDiagram,
} from '../diagrams/DhcpDnsDiagrams'
import {
  AuthenticationVsPrivacyDiagram,
  GetNextVsGetBulkDiagram,
  ManagerVsAgentDiagram,
  MibStructureDiagram,
  MonitoringDashboardDiagram,
  OidExplorerDiagram,
  OidHierarchyDiagram,
  SecurityLevelsDiagram,
  SnmpArchitectureDiagram,
  SnmpGetOperationDiagram,
  SnmpInformDiagram,
  SnmpOperationsExplorerDiagram,
  SnmpPollingDiagram,
  SnmpRequestResponseDiagram,
  SnmpSetOperationDiagram,
  SnmpTrapDiagram,
  SnmpTroubleshootingFlowDiagram,
  SnmpUdpPortsDiagram,
  VersionsComparisonDiagram,
} from '../diagrams/SnmpDiagrams'
import {
  BufferedLoggingDiagram,
  CentralizedMonitoringDiagram as SyslogCentralizedMonitoringDiagram,
  CompleteLoggingLifecycleDiagram,
  ConsoleVsMonitorDiagram,
  FacilityExplorerDiagram,
  FacilityVsSeverityDiagram,
  LocalVsRemoteLoggingDiagram,
  PriCalculatorDiagram,
  PriStructureDiagram,
  RemoteSyslogConfigFlowDiagram,
  SeverityScaleDiagram,
  SeverityThresholdDiagram,
  SyslogArchitectureDiagram,
  SyslogMessageFlowDiagram,
  SyslogMessageFormatDiagram,
  SyslogMessageInspectorDiagram,
  SyslogTimestampTimelineDiagram,
  SyslogTransportDiagram,
  SyslogTroubleshootingFlowDiagram,
} from '../diagrams/SyslogDiagrams'
import {
  CompleteDhcpLifecycleDiagram,
  DhcpBeforeAfterDiagram,
  DhcpBroadcastLimitationDiagram,
  DhcpClientConfigDiagram,
  DhcpClientLeaseAcquisitionDiagram,
  DhcpConfigBuilderDiagram,
  DhcpPoolExhaustionDiagram,
  DhcpPoolExplorerDiagram,
  DhcpPoolSelectionDiagram,
  DhcpRelayArchitectureDiagram,
  DhcpRelayMessageFlowDiagram,
  DhcpRelayTroubleshootingDiagram,
  DhcpServerArchitectureDiagram,
  DhcpServerConfigFlowDiagram,
  DhcpServerVerificationDiagram,
  DhcpServerVsClientDiagram,
  DhcpTroubleshootingTreeDiagram,
  ExcludedAddressVisualizerDiagram,
  GiaddrExplanationDiagram,
  HelperAddressPlacementDiagram,
} from '../diagrams/DhcpConfigDiagrams'
import {
  AfDropPrecedenceDiagram,
  CongestionSimulationDiagram,
  Cos8021qFieldDiagram,
  DscpExplorerDiagram,
  DscpIpHeaderDiagram,
  DscpVsCosDiagram,
  EndToEndQosDiagram,
  FifoQueueDiagram,
  PacketMarkingDiagram,
  PerHopBehaviorDiagram,
  PolicingSimulationDiagram,
  PolicingVsShapingDiagram,
  PriorityQueueDiagram,
  QosFundamentalsDiagram,
  QosMetricsDiagram,
  QosPipelineDiagram,
  QosTroubleshootingFlowDiagram,
  ShapingSimulationDiagram,
  TrafficClassifierDiagram,
  WfqLlqDiagram,
} from '../diagrams/QosDiagrams'
import {
  LocalAuthenticationFlowDiagram,
  RemoteManagementOverviewDiagram,
  RsaKeyPairDiagram,
  RsaKeySizeExplorerDiagram,
  SecureManagementTopologyDiagram,
  SshClientServerDiagram,
  SshConfigBuilderDiagram,
  SshConfigLifecycleDiagram,
  SshConnectionLifecycleDiagram,
  SshKeyExchangeDiagram,
  SshServerVsUserAuthDiagram,
  SshTroubleshootingFlowDiagram,
  SshVerificationDashboardDiagram,
  SshVersionComparisonDiagram,
  SshVsTelnetDiagram,
  TcpPort22Diagram,
  VtyAclRestrictionDiagram,
  VtyConfigFlowDiagram,
  VtyLinesArchitectureDiagram,
} from '../diagrams/SshConfigDiagrams'
import {
  ActiveFtpDiagram,
  ClientVsServerDiagram,
  CompleteBackupLifecycleDiagram,
  ConfigBackupFlowDiagram,
  ConfigRestoreFlowDiagram,
  FileTransferExplorerDiagram,
  FileTransferFundamentalsDiagram,
  FileTransferTroubleshootingDiagram,
  FlashStorageVerificationDiagram,
  FtpArchitectureDiagram,
  FtpControlVsDataDiagram,
  IosImageTransferDiagram,
  PassiveFtpDiagram,
  ProtocolComparisonDiagram,
  RunningVsStartupConfigDiagram,
  TftpArchitectureDiagram,
  TftpBlockSizeDiagram,
  TftpConfigTransferDiagram,
  TftpDataAckDiagram,
  TftpRrqFlowDiagram,
  TftpWrqFlowDiagram,
  UploadVsDownloadDiagram,
} from '../diagrams/FileTransferDiagrams'
import {
  AvailabilityControlsDiagram,
  CiaImpactAnalyzerDiagram,
  CiaTriadDiagram,
  ConfidentialityControlsDiagram,
  DefenseInDepthDiagram,
  DosVsDdosDiagram,
  ExploitImpactDiagram,
  InternalExternalThreatsDiagram,
  IntegrityControlsDiagram,
  MalwareExplorerDiagram,
  ManInTheMiddleDiagram,
  RansomwareLifecycleDiagram,
  SecurityAssetsExplorerDiagram,
  SecurityIncidentLifecycleDiagram,
  SecurityOverviewDiagram,
  ThreatCategoriesDiagram,
  ThreatMitigationMappingDiagram,
  ThreatVulnerabilityRiskDiagram,
  VirusWormTrojanDiagram,
  VulnerabilityExploitLifecycleDiagram,
} from '../diagrams/NetworkSecurityConceptsDiagrams'
import {
  AccessCardAuthenticationDiagram,
  AccessControlModelsDiagram,
  AuthenticationVsAuthorizationDiagram,
  CompleteSecurityProgramDiagram,
  DataCenterSecurityDiagram,
  IncidentReportingWorkflowDiagram,
  LeastPrivilegeDiagram,
  PeopleProcessTechnologyDiagram,
  PhishingSimulatorDiagram,
  PhysicalSecurityLayersDiagram,
  PhysicalVsLogicalAccessDiagram,
  RoleBasedAccessMatrixDiagram,
  SecurityPolicyFrameworkDiagram,
  SecurityProgramMetricsDiagram,
  SecurityProgramOverviewDiagram,
  SocialEngineeringDiagram,
  TrainingFrameworkDiagram,
  TrainingPlannerDiagram,
  UserAwarenessLifecycleDiagram,
  VisitorAccessControlDiagram,
} from '../diagrams/SecurityProgramElementsDiagrams'
import {
  AuthTroubleshootingDiagram,
  CompleteDeviceAuthDiagram,
  ConsoleAuthFlowDiagram,
  ConsoleLinePasswordDiagram,
  ConsoleVtyAccessDiagram,
  DeviceAccessOverviewDiagram,
  EnablePasswordFlowDiagram,
  EnablePasswordVsSecretDiagram,
  EnableSecretFlowDiagram,
  IosAccessLevelsDiagram,
  LocalUserAuthFlowDiagram,
  LocalUsernameDatabaseDiagram,
  LoginVsLoginLocalDiagram,
  PasswordHashingConceptDiagram,
  PasswordStorageComparisonDiagram,
  RunningVsStartupDiagram,
  SecureConfigSequenceDiagram,
  Type7ObfuscationDiagram,
  UserVsPrivilegedDiagram,
  VerificationCommandExplorerDiagram,
} from '../diagrams/DeviceAccessControlDiagrams'
import {
  AaaConceptsDiagram,
  AccessScenariosDiagram,
  AttackComparisonDiagram,
  AuthFactorsDiagram,
  BiometricFlowDiagram,
  BiometricLimitsDiagram,
  CaHierarchyDiagram,
  CertificateStructureDiagram,
  CertificateValidationFlowDiagram,
  CredentialStuffingFlowDiagram,
  EncryptionVsSignatureDiagram,
  FarFrrDiagram,
  HardwareKeyFlowDiagram,
  HashingVsEncryptionDiagram,
  LabCertValidationDiagram,
  LabMfaChoiceDiagram,
  LabPasswordStrengthDiagram,
  LayeredAuthArchitectureDiagram,
  LengthEntropyDiagram,
  MfaFlowDiagram,
  MfaMethodsDiagram,
  PasswordManagementFlowDiagram,
  PasswordManagerArchitectureDiagram,
  PasswordPatternsDiagram,
  PasswordSecurityOverviewDiagram,
  PhishingRecoveryDiagram,
  PkiArchitectureDiagram,
  RateLimitingDiagram,
  SecurePasswordHandlingDiagram,
  Sfa2faMfaDiagram,
} from '../diagrams/PasswordSecurityDiagrams'
import {
  VpnOverviewDiagram,
  VpnTunnelPathDiagram,
  VpnEndpointsDiagram,
  VpnTunnelWorkflowDiagram,
  VpnEncapsulationEncryptionDiagram,
  VpnRemoteTopologyDiagram,
  VpnRemoteAuthFlowDiagram,
  VpnTunnelSplitDiagram,
  VpnSiteTopologyDiagram,
  VpnSiteFlowDiagram,
  VpnArchitectureCompareDiagram,
  VpnIpsecGoalsDiagram,
  VpnIpsecComponentsDiagram,
  VpnAhProtectionDiagram,
  VpnEspProtectionDiagram,
  VpnAhVsEspDiagram,
  VpnIkeNegotiationDiagram,
  VpnSaConceptDiagram,
  VpnPacketModesDiagram,
  VpnModeCompareDiagram,
  VpnEncryptionFlowDiagram,
  VpnPskAuthDiagram,
  VpnCertAuthDiagram,
  VpnAntiReplayDiagram,
  VpnTroubleshootingTreeDiagram,
  VpnLabArchitectureDiagram,
  VpnLabModesDiagram,
  VpnLabTroubleshootDiagram,
  VpnSummaryDiagram,
} from '../diagrams/VpnDiagrams'
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
    case 'basic-wlan-architecture':
      return <BasicWlanArchitectureDiagram />
    case 'autonomous-ap-architecture':
      return <AutonomousApArchitectureDiagram />
    case 'lightweight-ap-wlc-architecture':
      return <LightweightApWlcDiagram />
    case 'centralized-wireless-deployment':
      return <CentralizedWirelessDeploymentDiagram />
    case 'cloud-based-wireless-management':
      return <CloudBasedWirelessDiagram />
    case 'embedded-wireless-controller-architecture':
      return <EmbeddedWirelessControllerDiagram />
    case 'capwap-ap-discovery':
      return <CapwapDiscoveryDiagram />
    case 'capwap-join-process':
      return <CapwapJoinDiagram />
    case 'capwap-control-vs-data':
      return <CapwapControlVsDataDiagram />
    case 'local-mode-ap':
      return <LocalModeApDiagram />
    case 'flexconnect-local-vs-central-switching':
      return <FlexConnectSwitchingDiagram />
    case 'monitor-vs-sniffer-mode':
      return <MonitorVsSnifferDiagram />
    case 'rogue-detector-mode':
      return <RogueDetectorModeDiagram />
    case 'wireless-bridge-mode':
      return <WirelessBridgeModeDiagram />
    case 'ap-modes-comparison':
      return <ApModesComparisonDiagram />
    case 'enterprise-wlan-physical-topology':
      return <EnterpriseWlanPhysicalTopologyDiagram />
    case 'ap-to-access-switch-connection':
      return <ApToAccessSwitchConnectionDiagram />
    case 'poe-power-delivery':
      return <PoePowerDeliveryDiagram />
    case 'poe-injector-vs-poe-switch':
      return <PoeInjectorVsPoeSwitchDiagram />
    case 'poe-power-budget':
      return <PoePowerBudgetDiagram />
    case 'wlc-physical-connectivity':
      return <WlcPhysicalConnectivityDiagram />
    case 'wlc-physical-vs-logical-interfaces':
      return <WlcPhysicalVsLogicalInterfacesDiagram />
    case 'ap-access-port':
      return <ApAccessPortDiagram />
    case 'ap-trunk-port':
      return <ApTrunkPortDiagram />
    case 'multiple-wlans-vlans-ap-uplink':
      return <MultipleWlanVlansAcrossApUplinkDiagram />
    case 'ap-to-wlc-capwap-physical-path':
      return <ApToWlcCapwapPhysicalPathDiagram />
    case 'wlc-lag-architecture':
      return <WlcLagArchitectureDiagram />
    case 'switch-port-channel-to-wlc':
      return <SwitchPortChannelToWlcDiagram />
    case 'physical-link-failure-redundancy':
      return <PhysicalLinkFailureRedundancyDiagram />
    case 'network-device-management-overview':
      return <NetworkDeviceManagementOverviewDiagram />
    case 'in-band-management-path':
      return <InBandManagementPathDiagram />
    case 'out-of-band-management-path':
      return <OutOfBandManagementPathDiagram />
    case 'console-connection':
      return <ConsoleConnectionDiagram />
    case 'aux-modem-access':
      return <AuxModemAccessDiagram />
    case 'telnet-plaintext-communication':
      return <TelnetPlaintextCommunicationDiagram />
    case 'ssh-encrypted-communication':
      return <SshEncryptedCommunicationDiagram />
    case 'http-vs-https-management':
      return <HttpVsHttpsManagementDiagram />
    case 'cli-vs-web-gui-management':
      return <CliVsWebGuiManagementDiagram />
    case 'aaa-authentication-flow':
      return <AaaAuthenticationFlowDiagram />
    case 'aaa-authn-authz-acct':
      return <AaaAuthnAuthzAcctDiagram />
    case 'tacacs-plus-architecture':
      return <TacacsPlusArchitectureDiagram />
    case 'radius-architecture':
      return <RadiusArchitectureDiagram />
    case 'tacacs-vs-radius-comparison':
      return <TacacsVsRadiusComparisonDiagram />
    case 'local-vs-centralized-authentication':
      return <LocalVsCentralizedAuthenticationDiagram />
    case 'enterprise-wlan-architecture':
      return <EnterpriseWlanArchitectureDiagram />
    case 'wlc-gui-configuration-workflow':
      return <WlcGuiConfigurationWorkflowDiagram />
    case 'wlan-profile-vs-ssid':
      return <WlanProfileVsSsidDiagram />
    case 'wlan-to-vlan-mapping':
      return <WlanToVlanMappingDiagram />
    case 'multiple-wlans-vlans':
      return <MultipleWlansVlansDiagram />
    case 'wpa2-psk-security-architecture':
      return <Wpa2PskSecurityArchitectureDiagram />
    case 'wpa2-authentication-flow':
      return <Wpa2AuthenticationFlowDiagram />
    case 'wireless-client-ssid-discovery':
      return <WirelessClientSsidDiscoveryDiagram />
    case 'wireless-client-association':
      return <WirelessClientAssociationDiagram />
    case 'dhcp-after-association':
      return <DhcpAfterAssociationDiagram />
    case 'wireless-client-traffic-through-wlc':
      return <WirelessClientTrafficThroughWlcDiagram />
    case 'complete-wlan-config-verification-workflow':
      return <CompleteWlanConfigVerificationWorkflowDiagram />
    case 'common-wlan-configuration-failures':
      return <CommonWlanConfigurationFailuresDiagram />
    case 'routing-table-concept':
      return <RoutingTableConceptDiagram />
    case 'routing-table-entry-anatomy':
      return <RoutingTableEntryAnatomyDiagram />
    case 'connected-route':
      return <ConnectedRouteDiagram />
    case 'local-route':
      return <LocalRouteDiagram />
    case 'static-route':
      return <StaticRouteDiagram />
    case 'dynamic-route':
      return <DynamicRouteDiagram />
    case 'route-codes':
      return <RouteCodesDiagram />
    case 'prefix-and-network-mask':
      return <PrefixAndNetworkMaskDiagram />
    case 'next-hop':
      return <NextHopDiagram />
    case 'exit-interface':
      return <ExitInterfaceDiagram />
    case 'administrative-distance-comparison':
      return <AdministrativeDistanceComparisonDiagram />
    case 'metric-comparison':
      return <MetricComparisonDiagram />
    case 'ad-vs-metric':
      return <AdVsMetricDiagram />
    case 'gateway-of-last-resort':
      return <GatewayOfLastResortDiagram />
    case 'complete-routing-table-example':
      return <CompleteRoutingTableExampleDiagram />
    case 'routing-vs-forwarding':
      return <RoutingVsForwardingDiagram />
    case 'packet-forwarding-lifecycle':
      return <PacketForwardingLifecycleDiagram />
    case 'control-plane-vs-data-plane':
      return <ControlPlaneVsDataPlaneDiagram />
    case 'router-hop-by-hop-forwarding':
      return <RouterHopByHopForwardingDiagram />
    case 'layer2-reencapsulation':
      return <Layer2ReencapsulationDiagram />
    case 'arp-next-hop-resolution':
      return <ArpNextHopResolutionDiagram />
    case 'longest-prefix-match-concept':
      return <LongestPrefixMatchConceptDiagram />
    case 'binary-prefix-matching':
      return <BinaryPrefixMatchingDiagram />
    case 'multiple-prefix-comparison':
      return <MultiplePrefixComparisonDiagram />
    case 'ad-route-source-comparison':
      return <AdRouteSourceComparisonDiagram />
    case 'routing-protocol-metrics-comparison':
      return <RoutingProtocolMetricsComparisonDiagram />
    case 'ad-metric-decision-process':
      return <AdMetricDecisionProcessDiagram />
    case 'best-route-selection-flowchart':
      return <BestRouteSelectionFlowchartDiagram />
    case 'default-route-gateway-last-resort':
      return <DefaultRouteGatewayLastResortDiagram />
    case 'complete-routing-decision-scenario':
      return <CompleteRoutingDecisionScenarioDiagram />
    case 'static-routing-concept':
      return <StaticRoutingConceptDiagram />
    case 'static-vs-dynamic-routing':
      return <StaticVsDynamicRoutingDiagram />
    case 'network-static-route':
      return <NetworkStaticRouteDiagram />
    case 'host-static-route':
      return <HostStaticRouteDiagram />
    case 'default-static-route':
      return <DefaultStaticRouteDiagram />
    case 'floating-static-route':
      return <FloatingStaticRouteDiagram />
    case 'primary-vs-backup-path':
      return <PrimaryVsBackupPathDiagram />
    case 'recursive-static-route':
      return <RecursiveStaticRouteDiagram />
    case 'directly-connected-static-route':
      return <DirectlyConnectedStaticRouteDiagram />
    case 'next-hop-vs-exit-interface':
      return <NextHopVsExitInterfaceDiagram />
    case 'ipv4-static-routing-topology':
      return <Ipv4StaticRoutingTopologyDiagram />
    case 'ipv6-static-routing-topology':
      return <Ipv6StaticRoutingTopologyDiagram />
    case 'ipv6-link-local-next-hop':
      return <Ipv6LinkLocalNextHopDiagram />
    case 'routing-table-before-after-static':
      return <RoutingTableBeforeAfterStaticDiagram />
    case 'complete-static-routing-flow':
      return <CompleteStaticRoutingFlowDiagram />
    case 'dynamic-vs-static-routing':
      return <DynamicVsStaticRoutingDiagram />
    case 'ospf-architecture-overview':
      return <OspfArchitectureOverviewDiagram />
    case 'ospf-operation-lifecycle':
      return <OspfOperationLifecycleDiagram />
    case 'router-id-selection':
      return <RouterIdSelectionDiagram />
    case 'hello-packet-exchange':
      return <HelloPacketExchangeDiagram />
    case 'hello-and-dead-intervals':
      return <HelloAndDeadIntervalsDiagram />
    case 'ospf-neighbor-states':
      return <OspfNeighborStatesDiagram />
    case 'neighbor-vs-full-adjacency':
      return <NeighborVsFullAdjacencyDiagram />
    case 'link-state-database':
      return <LinkStateDatabaseDiagram />
    case 'spf-algorithm':
      return <SpfAlgorithmDiagram />
    case 'point-to-point-ospf':
      return <PointToPointOspfDiagram />
    case 'broadcast-multiaccess-ospf':
      return <BroadcastMultiaccessOspfDiagram />
    case 'dr-bdr-election':
      return <DrBdrElectionDiagram />
    case 'ospf-cost-calculation':
      return <OspfCostCalculationDiagram />
    case 'ospf-best-path-selection':
      return <OspfBestPathSelectionDiagram />
    case 'single-area-ospf-topology':
      return <SingleAreaOspfTopologyDiagram />
    case 'ospf-configuration-flow':
      return <OspfConfigurationFlowDiagram />
    case 'ospf-troubleshooting-flow':
      return <OspfTroubleshootingFlowDiagram />
    case 'single-gateway-failure':
      return <SingleGatewayFailureDiagram />
    case 'gateway-redundancy-concept':
      return <GatewayRedundancyConceptDiagram />
    case 'physical-vs-virtual-ip':
      return <PhysicalVsVirtualIpDiagram />
    case 'virtual-mac-address':
      return <VirtualMacAddressDiagram />
    case 'fhrp-operation':
      return <FhrpOperationDiagram />
    case 'hsrp-active-standby':
      return <HsrpActiveStandbyDiagram />
    case 'hsrp-state-machine':
      return <HsrpStateMachineDiagram />
    case 'hsrp-hello-hold-timers':
      return <HsrpHelloHoldTimersDiagram />
    case 'hsrp-priority-election':
      return <HsrpPriorityElectionDiagram />
    case 'hsrp-preemption':
      return <HsrpPreemptionDiagram />
    case 'hsrp-failover-timeline':
      return <HsrpFailoverTimelineDiagram />
    case 'interface-tracking':
      return <InterfaceTrackingDiagram />
    case 'vrrp-master-backup':
      return <VrrpMasterBackupDiagram />
    case 'hsrp-vs-vrrp-comparison':
      return <HsrpVsVrrpComparisonDiagram />
    case 'complete-gateway-redundancy-topology':
      return <CompleteGatewayRedundancyTopologyDiagram />
    case 'nat-concept':
      return <NatConceptDiagram />
    case 'nat-private-vs-public-ip':
      return <NatPrivateVsPublicIpDiagram />
    case 'nat-packet-flow':
      return <NatPacketFlowDiagram />
    case 'nat-inside-local-global':
      return <NatInsideLocalGlobalDiagram />
    case 'nat-outside-local-global':
      return <NatOutsideLocalGlobalDiagram />
    case 'nat-terminology-complete':
      return <NatTerminologyCompleteDiagram />
    case 'static-nat-mapping':
      return <StaticNatMappingDiagram />
    case 'dynamic-nat-mapping':
      return <DynamicNatMappingDiagram />
    case 'nat-pool':
      return <NatPoolDiagram />
    case 'pat-nat-overload':
      return <PatNatOverloadDiagram />
    case 'nat-port-translation':
      return <NatPortTranslationDiagram />
    case 'nat-translation-table':
      return <NatTranslationTableDiagram />
    case 'nat-types-comparison':
      return <NatTypesComparisonDiagram />
    case 'nat-configuration-topology':
      return <NatConfigurationTopologyDiagram />
    case 'nat-troubleshooting-flow':
      return <NatTroubleshootingFlowDiagram />
    case 'nat-before-after-translation':
      return <NatBeforeAfterTranslationDiagram />
    case 'ntp-concept':
      return <NtpConceptDiagram />
    case 'ntp-client-vs-server':
      return <NtpClientVsServerDiagram />
    case 'ntp-request-response':
      return <NtpRequestResponseDiagram />
    case 'ntp-synchronization-lifecycle':
      return <NtpSynchronizationLifecycleDiagram />
    case 'stratum-hierarchy':
      return <StratumHierarchyDiagram />
    case 'stratum-0-vs-1':
      return <Stratum0Vs1Diagram />
    case 'stratum-2-to-15':
      return <Stratum2To15Diagram />
    case 'stratum-16-unsynchronized':
      return <Stratum16UnsynchronizedDiagram />
    case 'ntp-network-topology':
      return <NtpNetworkTopologyDiagram />
    case 'ntp-client-configuration':
      return <NtpClientConfigurationDiagram />
    case 'ntp-server-configuration':
      return <NtpServerConfigurationDiagram />
    case 'clock-synchronization':
      return <ClockSynchronizationDiagram />
    case 'utc-vs-local-time-zone':
      return <UtcVsLocalTimeZoneDiagram />
    case 'ntp-association-states':
      return <NtpAssociationStatesDiagram />
    case 'ntp-troubleshooting-flow':
      return <NtpTroubleshootingFlowDiagram />
    case 'dhcp-concept':
      return <DhcpConceptDiagram />
    case 'dhcp-client-vs-server':
      return <DhcpClientServerDiagram />
    case 'dora-process':
      return <DoraProcessDiagram />
    case 'dhcp-discover-packet':
      return <DhcpDiscoverPacketDiagram />
    case 'dhcp-offer-packet':
      return <DhcpOfferPacketDiagram />
    case 'dhcp-request-packet':
      return <DhcpRequestPacketDiagram />
    case 'dhcp-ack-packet':
      return <DhcpAckPacketDiagram />
    case 'dhcp-lease-lifecycle':
      return <DhcpLeaseLifecycleDiagram />
    case 'dhcp-packet-fields':
      return <DhcpPacketFieldsDiagram />
    case 'dns-resolution-overview':
      return <DnsResolutionOverviewDiagram />
    case 'dns-hierarchy':
      return <DnsHierarchyDiagram />
    case 'recursive-vs-iterative':
      return <RecursiveVsIterativeDiagram />
    case 'dns-cache':
      return <DnsCacheDiagram />
    case 'dns-record-types':
      return <DnsRecordTypesDiagram />
    case 'forward-vs-reverse-lookup':
      return <ForwardVsReverseLookupDiagram />
    case 'dhcp-dns-interaction':
      return <DhcpDnsInteractionDiagram />
    case 'complete-network-connection-lifecycle':
      return <CompleteConnectionLifecycleDiagram />
    case 'dhcp-dns-troubleshooting-flow':
      return <DhcpDnsTroubleshootingFlowDiagram />
    case 'snmp-architecture':
      return <SnmpArchitectureDiagram />
    case 'manager-vs-agent':
      return <ManagerVsAgentDiagram />
    case 'snmp-request-response':
      return <SnmpRequestResponseDiagram />
    case 'snmp-polling':
      return <SnmpPollingDiagram />
    case 'snmp-trap':
      return <SnmpTrapDiagram />
    case 'snmp-inform':
      return <SnmpInformDiagram />
    case 'mib-structure':
      return <MibStructureDiagram />
    case 'oid-hierarchy':
      return <OidHierarchyDiagram />
    case 'oid-explorer':
      return <OidExplorerDiagram />
    case 'snmp-get':
      return <SnmpGetOperationDiagram />
    case 'get-next-vs-get-bulk':
      return <GetNextVsGetBulkDiagram />
    case 'snmp-set':
      return <SnmpSetOperationDiagram />
    case 'versions-comparison':
      return <VersionsComparisonDiagram />
    case 'snmpv3-security-levels':
      return <SecurityLevelsDiagram />
    case 'auth-vs-privacy':
      return <AuthenticationVsPrivacyDiagram />
    case 'snmp-udp-ports':
      return <SnmpUdpPortsDiagram />
    case 'monitoring-dashboard':
      return <MonitoringDashboardDiagram />
    case 'snmp-troubleshooting-flow':
      return <SnmpTroubleshootingFlowDiagram />
    case 'snmp-operations-explorer':
      return <SnmpOperationsExplorerDiagram />
    case 'syslog-architecture':
      return <SyslogArchitectureDiagram />
    case 'local-vs-remote-logging':
      return <LocalVsRemoteLoggingDiagram />
    case 'syslog-message-flow':
      return <SyslogMessageFlowDiagram />
    case 'syslog-transport-protocols':
      return <SyslogTransportDiagram />
    case 'syslog-message-format':
      return <SyslogMessageFormatDiagram />
    case 'pri-structure':
      return <PriStructureDiagram />
    case 'pri-calculator':
      return <PriCalculatorDiagram />
    case 'severity-scale':
      return <SeverityScaleDiagram />
    case 'severity-threshold':
      return <SeverityThresholdDiagram />
    case 'facility-explorer':
      return <FacilityExplorerDiagram />
    case 'facility-vs-severity':
      return <FacilityVsSeverityDiagram />
    case 'syslog-centralized-monitoring':
      return <SyslogCentralizedMonitoringDiagram />
    case 'buffered-logging':
      return <BufferedLoggingDiagram />
    case 'console-vs-monitor':
      return <ConsoleVsMonitorDiagram />
    case 'remote-syslog-config-flow':
      return <RemoteSyslogConfigFlowDiagram />
    case 'syslog-timestamp-timeline':
      return <SyslogTimestampTimelineDiagram />
    case 'syslog-troubleshooting-flow':
      return <SyslogTroubleshootingFlowDiagram />
    case 'complete-logging-lifecycle':
      return <CompleteLoggingLifecycleDiagram />
    case 'syslog-message-inspector':
      return <SyslogMessageInspectorDiagram />
    case 'dhcp-server-architecture':
      return <DhcpServerArchitectureDiagram />
    case 'dhcp-pool-explorer':
      return <DhcpPoolExplorerDiagram />
    case 'excluded-address-visualizer':
      return <ExcludedAddressVisualizerDiagram />
    case 'dhcp-server-config-flow':
      return <DhcpServerConfigFlowDiagram />
    case 'dhcp-config-builder':
      return <DhcpConfigBuilderDiagram />
    case 'dhcp-client-config':
      return <DhcpClientConfigDiagram />
    case 'dhcp-client-lease-acquisition':
      return <DhcpClientLeaseAcquisitionDiagram />
    case 'dhcp-server-vs-client':
      return <DhcpServerVsClientDiagram />
    case 'dhcp-relay-architecture':
      return <DhcpRelayArchitectureDiagram />
    case 'dhcp-broadcast-limitation':
      return <DhcpBroadcastLimitationDiagram />
    case 'dhcp-relay-message-flow':
      return <DhcpRelayMessageFlowDiagram />
    case 'helper-address-placement':
      return <HelperAddressPlacementDiagram />
    case 'giaddr-explanation':
      return <GiaddrExplanationDiagram />
    case 'dhcp-pool-selection':
      return <DhcpPoolSelectionDiagram />
    case 'dhcp-server-verification':
      return <DhcpServerVerificationDiagram />
    case 'dhcp-relay-troubleshooting':
      return <DhcpRelayTroubleshootingDiagram />
    case 'dhcp-pool-exhaustion':
      return <DhcpPoolExhaustionDiagram />
    case 'dhcp-troubleshooting-tree':
      return <DhcpTroubleshootingTreeDiagram />
    case 'complete-dhcp-lifecycle':
      return <CompleteDhcpLifecycleDiagram />
    case 'dhcp-before-after':
      return <DhcpBeforeAfterDiagram />
    case 'qos-fundamentals':
      return <QosFundamentalsDiagram />
    case 'qos-metrics':
      return <QosMetricsDiagram />
    case 'qos-pipeline':
      return <QosPipelineDiagram />
    case 'traffic-classifier':
      return <TrafficClassifierDiagram />
    case 'packet-marking':
      return <PacketMarkingDiagram />
    case 'dscp-ip-header':
      return <DscpIpHeaderDiagram />
    case 'cos-8021q-field':
      return <Cos8021qFieldDiagram />
    case 'dscp-vs-cos':
      return <DscpVsCosDiagram />
    case 'dscp-explorer':
      return <DscpExplorerDiagram />
    case 'af-drop-precedence':
      return <AfDropPrecedenceDiagram />
    case 'congestion-simulation':
      return <CongestionSimulationDiagram />
    case 'fifo-queue':
      return <FifoQueueDiagram />
    case 'priority-queue':
      return <PriorityQueueDiagram />
    case 'wfq-llq':
      return <WfqLlqDiagram />
    case 'policing-simulation':
      return <PolicingSimulationDiagram />
    case 'shaping-simulation':
      return <ShapingSimulationDiagram />
    case 'policing-vs-shaping':
      return <PolicingVsShapingDiagram />
    case 'per-hop-behavior':
      return <PerHopBehaviorDiagram />
    case 'end-to-end-qos':
      return <EndToEndQosDiagram />
    case 'qos-troubleshooting-flow':
      return <QosTroubleshootingFlowDiagram />
    case 'remote-management-overview':
      return <RemoteManagementOverviewDiagram />
    case 'ssh-vs-telnet':
      return <SshVsTelnetDiagram />
    case 'ssh-client-server':
      return <SshClientServerDiagram />
    case 'ssh-connection-lifecycle':
      return <SshConnectionLifecycleDiagram />
    case 'tcp-port-22':
      return <TcpPort22Diagram />
    case 'ssh-key-exchange':
      return <SshKeyExchangeDiagram />
    case 'rsa-public-private-keys':
      return <RsaKeyPairDiagram />
    case 'rsa-key-size-explorer':
      return <RsaKeySizeExplorerDiagram />
    case 'local-authentication-flow':
      return <LocalAuthenticationFlowDiagram />
    case 'ssh-server-vs-user-auth':
      return <SshServerVsUserAuthDiagram />
    case 'vty-lines-architecture':
      return <VtyLinesArchitectureDiagram />
    case 'vty-configuration-flow':
      return <VtyConfigFlowDiagram />
    case 'ssh-version-comparison':
      return <SshVersionComparisonDiagram />
    case 'ssh-verification-dashboard':
      return <SshVerificationDashboardDiagram />
    case 'vty-acl-restriction':
      return <VtyAclRestrictionDiagram />
    case 'ssh-troubleshooting-flow':
      return <SshTroubleshootingFlowDiagram />
    case 'secure-management-topology':
      return <SecureManagementTopologyDiagram />
    case 'complete-ssh-config-lifecycle':
      return <SshConfigLifecycleDiagram />
    case 'ssh-configuration-builder':
      return <SshConfigBuilderDiagram />
    case 'file-transfer-fundamentals':
      return <FileTransferFundamentalsDiagram />
    case 'client-vs-server':
      return <ClientVsServerDiagram />
    case 'tftp-architecture':
      return <TftpArchitectureDiagram />
    case 'tftp-rrq-flow':
      return <TftpRrqFlowDiagram />
    case 'tftp-wrq-flow':
      return <TftpWrqFlowDiagram />
    case 'tftp-data-ack':
      return <TftpDataAckDiagram />
    case 'tftp-block-size':
      return <TftpBlockSizeDiagram />
    case 'ftp-architecture':
      return <FtpArchitectureDiagram />
    case 'ftp-control-vs-data':
      return <FtpControlVsDataDiagram />
    case 'active-ftp':
      return <ActiveFtpDiagram />
    case 'passive-ftp':
      return <PassiveFtpDiagram />
    case 'protocol-comparison':
      return <ProtocolComparisonDiagram />
    case 'upload-vs-download':
      return <UploadVsDownloadDiagram />
    case 'file-transfer-explorer':
      return <FileTransferExplorerDiagram />
    case 'running-vs-startup-config':
      return <RunningVsStartupConfigDiagram />
    case 'config-backup-flow':
      return <ConfigBackupFlowDiagram />
    case 'config-restore-flow':
      return <ConfigRestoreFlowDiagram />
    case 'tftp-config-transfer':
      return <TftpConfigTransferDiagram />
    case 'ios-image-transfer':
      return <IosImageTransferDiagram />
    case 'flash-storage-verification':
      return <FlashStorageVerificationDiagram />
    case 'file-transfer-troubleshooting':
      return <FileTransferTroubleshootingDiagram />
    case 'complete-backup-lifecycle':
      return <CompleteBackupLifecycleDiagram />
    case 'security-overview':
      return <SecurityOverviewDiagram />
    case 'security-assets-explorer':
      return <SecurityAssetsExplorerDiagram />
    case 'threat-categories':
      return <ThreatCategoriesDiagram />
    case 'internal-external-threats':
      return <InternalExternalThreatsDiagram />
    case 'threat-vulnerability-risk':
      return <ThreatVulnerabilityRiskDiagram />
    case 'vulnerability-exploit-lifecycle':
      return <VulnerabilityExploitLifecycleDiagram />
    case 'exploit-impact':
      return <ExploitImpactDiagram />
    case 'malware-explorer':
      return <MalwareExplorerDiagram />
    case 'virus-worm-trojan':
      return <VirusWormTrojanDiagram />
    case 'ransomware-lifecycle':
      return <RansomwareLifecycleDiagram />
    case 'dos-vs-ddos':
      return <DosVsDdosDiagram />
    case 'man-in-the-middle':
      return <ManInTheMiddleDiagram />
    case 'cia-triad-diagram':
      return <CiaTriadDiagram />
    case 'confidentiality-controls':
      return <ConfidentialityControlsDiagram />
    case 'integrity-controls':
      return <IntegrityControlsDiagram />
    case 'availability-controls':
      return <AvailabilityControlsDiagram />
    case 'defense-in-depth':
      return <DefenseInDepthDiagram />
    case 'threat-mitigation-mapping':
      return <ThreatMitigationMappingDiagram />
    case 'security-incident-lifecycle':
      return <SecurityIncidentLifecycleDiagram />
    case 'cia-impact-analyzer':
      return <CiaImpactAnalyzerDiagram />
    case 'security-program-overview':
      return <SecurityProgramOverviewDiagram />
    case 'people-process-technology':
      return <PeopleProcessTechnologyDiagram />
    case 'user-awareness-lifecycle':
      return <UserAwarenessLifecycleDiagram />
    case 'phishing-email-indicators':
      return <PhishingSimulatorDiagram />
    case 'social-engineering-examples':
      return <SocialEngineeringDiagram />
    case 'security-training-framework':
      return <TrainingFrameworkDiagram />
    case 'training-by-role':
      return <TrainingPlannerDiagram />
    case 'physical-security-layers':
      return <PhysicalSecurityLayersDiagram />
    case 'data-center-security':
      return <DataCenterSecurityDiagram />
    case 'access-card-authentication':
      return <AccessCardAuthenticationDiagram />
    case 'physical-vs-logical-access':
      return <PhysicalVsLogicalAccessDiagram />
    case 'authentication-vs-authorization':
      return <AuthenticationVsAuthorizationDiagram />
    case 'access-control-models':
      return <AccessControlModelsDiagram />
    case 'least-privilege':
      return <LeastPrivilegeDiagram />
    case 'rbac-access-matrix':
      return <RoleBasedAccessMatrixDiagram />
    case 'security-policy-framework':
      return <SecurityPolicyFrameworkDiagram />
    case 'incident-reporting-workflow':
      return <IncidentReportingWorkflowDiagram />
    case 'security-program-metrics':
      return <SecurityProgramMetricsDiagram />
    case 'visitor-access-control':
      return <VisitorAccessControlDiagram />
    case 'complete-security-program':
      return <CompleteSecurityProgramDiagram />
    case 'device-access-control-overview':
      return <DeviceAccessOverviewDiagram />
    case 'ios-access-levels':
      return <IosAccessLevelsDiagram />
    case 'user-exec-vs-privileged':
      return <UserVsPrivilegedDiagram />
    case 'console-authentication-flow':
      return <ConsoleAuthFlowDiagram />
    case 'console-line-password':
      return <ConsoleLinePasswordDiagram />
    case 'local-user-authentication-flow':
      return <LocalUserAuthFlowDiagram />
    case 'login-vs-login-local':
      return <LoginVsLoginLocalDiagram />
    case 'enable-password-flow':
      return <EnablePasswordFlowDiagram />
    case 'enable-secret-flow':
      return <EnableSecretFlowDiagram />
    case 'enable-password-vs-secret':
      return <EnablePasswordVsSecretDiagram />
    case 'local-username-database':
      return <LocalUsernameDatabaseDiagram />
    case 'password-storage-comparison':
      return <PasswordStorageComparisonDiagram />
    case 'type7-obfuscation':
      return <Type7ObfuscationDiagram />
    case 'password-hashing-concept':
      return <PasswordHashingConceptDiagram />
    case 'device-access-running-vs-startup':
      return <RunningVsStartupDiagram />
    case 'console-vty-access':
      return <ConsoleVtyAccessDiagram />
    case 'complete-device-authentication':
      return <CompleteDeviceAuthDiagram />
    case 'authentication-troubleshooting-tree':
      return <AuthTroubleshootingDiagram />
    case 'secure-config-sequence':
      return <SecureConfigSequenceDiagram />
    case 'verification-command-explorer':
      return <VerificationCommandExplorerDiagram />
    case 'ps-overview':
      return <PasswordSecurityOverviewDiagram />
    case 'ps-aaa-concepts':
      return <AaaConceptsDiagram />
    case 'ps-access-scenarios':
      return <AccessScenariosDiagram />
    case 'ps-password-patterns':
      return <PasswordPatternsDiagram />
    case 'ps-length-entropy':
      return <LengthEntropyDiagram />
    case 'ps-attack-comparison':
      return <AttackComparisonDiagram />
    case 'ps-credential-stuffing-flow':
      return <CredentialStuffingFlowDiagram />
    case 'ps-rate-limiting':
      return <RateLimitingDiagram />
    case 'ps-management-flow':
      return <PasswordManagementFlowDiagram />
    case 'ps-manager-architecture':
      return <PasswordManagerArchitectureDiagram />
    case 'ps-secure-handling':
      return <SecurePasswordHandlingDiagram />
    case 'ps-hashing-vs-encryption':
      return <HashingVsEncryptionDiagram />
    case 'ps-auth-factors':
      return <AuthFactorsDiagram />
    case 'ps-sfa-2fa-mfa':
      return <Sfa2faMfaDiagram />
    case 'ps-mfa-flow':
      return <MfaFlowDiagram />
    case 'ps-mfa-methods':
      return <MfaMethodsDiagram />
    case 'ps-hardware-key-flow':
      return <HardwareKeyFlowDiagram />
    case 'ps-phishing-recovery':
      return <PhishingRecoveryDiagram />
    case 'ps-pki-architecture':
      return <PkiArchitectureDiagram />
    case 'ps-ca-hierarchy':
      return <CaHierarchyDiagram />
    case 'ps-certificate-structure':
      return <CertificateStructureDiagram />
    case 'ps-cert-validation-flow':
      return <CertificateValidationFlowDiagram />
    case 'ps-encryption-vs-signature':
      return <EncryptionVsSignatureDiagram />
    case 'ps-biometric-flow':
      return <BiometricFlowDiagram />
    case 'ps-biometric-far-frr':
      return <FarFrrDiagram />
    case 'ps-biometric-limits':
      return <BiometricLimitsDiagram />
    case 'ps-lab-password-strength':
      return <LabPasswordStrengthDiagram />
    case 'ps-lab-mfa-choice':
      return <LabMfaChoiceDiagram />
    case 'ps-lab-cert-validation':
      return <LabCertValidationDiagram />
    case 'ps-layered-auth':
      return <LayeredAuthArchitectureDiagram />
    case 'vpn-overview':
      return <VpnOverviewDiagram />
    case 'vpn-tunnel-path':
      return <VpnTunnelPathDiagram />
    case 'vpn-endpoints':
      return <VpnEndpointsDiagram />
    case 'vpn-workflow':
      return <VpnTunnelWorkflowDiagram />
    case 'vpn-protection-functions':
      return <VpnEncapsulationEncryptionDiagram />
    case 'vpn-remote-topology':
      return <VpnRemoteTopologyDiagram />
    case 'vpn-remote-auth':
      return <VpnRemoteAuthFlowDiagram />
    case 'vpn-tunnel-split':
      return <VpnTunnelSplitDiagram />
    case 'vpn-site-topology':
      return <VpnSiteTopologyDiagram />
    case 'vpn-site-flow':
      return <VpnSiteFlowDiagram />
    case 'vpn-architecture-compare':
      return <VpnArchitectureCompareDiagram />
    case 'vpn-ipsec-goals':
      return <VpnIpsecGoalsDiagram />
    case 'vpn-ipsec-components':
      return <VpnIpsecComponentsDiagram />
    case 'vpn-ah-protection':
      return <VpnAhProtectionDiagram />
    case 'vpn-esp-protection':
      return <VpnEspProtectionDiagram />
    case 'vpn-ah-vs-esp':
      return <VpnAhVsEspDiagram />
    case 'vpn-ike-negotiation':
      return <VpnIkeNegotiationDiagram />
    case 'vpn-sa-concept':
      return <VpnSaConceptDiagram />
    case 'vpn-packet-modes':
      return <VpnPacketModesDiagram />
    case 'vpn-mode-compare':
      return <VpnModeCompareDiagram />
    case 'vpn-encryption-flow':
      return <VpnEncryptionFlowDiagram />
    case 'vpn-psk-auth':
      return <VpnPskAuthDiagram />
    case 'vpn-cert-auth':
      return <VpnCertAuthDiagram />
    case 'vpn-anti-replay':
      return <VpnAntiReplayDiagram />
    case 'vpn-troubleshooting-tree':
      return <VpnTroubleshootingTreeDiagram />
    case 'vpn-lab-architecture':
      return <VpnLabArchitectureDiagram />
    case 'vpn-lab-modes':
      return <VpnLabModesDiagram />
    case 'vpn-lab-troubleshoot':
      return <VpnLabTroubleshootDiagram />
    case 'vpn-summary':
      return <VpnSummaryDiagram />
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
