import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import CanvasErrorBoundary from "../CanvasErrorBoundary";
import {
  aboutPrimaryTimelineIds,
  aboutStoryInitialNodeId,
  aboutStoryNodesById,
  type AboutStoryNode,
} from "../../content/aboutStory";
import AboutCameraRig from "./AboutCameraRig";
import AboutDebugPanel from "./AboutDebugPanel";
import AboutOverlay from "./AboutOverlay";
import AboutSceneController from "./AboutSceneController";
import { useAboutQualityMode } from "./useAboutQualityMode";
import { useAboutStoryStore } from "./useAboutStoryStore";
import { useAboutStoryTimeline } from "./runtime/useAboutStoryTimeline";
import { createCodexProbeAttributes } from "../../devtools/codexContext/probe";
import { removeRuntimeContextEntry, upsertRuntimeContextEntry } from "../../devtools/codexContext/runtimeRegistry";

interface AboutExperienceProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ABOUT_RUNTIME_CONTEXT_ID = "about:story-runtime";

const AboutExperience: React.FC<AboutExperienceProps> = ({ scrollContainerRef }) => {
  const aboutExperienceProbe = createCodexProbeAttributes({
    componentName: "AboutExperience",
    filePath: "/src/components/AboutStory/AboutExperience.tsx",
    componentPath: ["AboutPage", "AboutExperience"],
    role: "interactive-stage",
  });

  const sectionRef = useRef<HTMLElement>(null);
  const qualityMode = useAboutQualityMode();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const branchPath = useAboutStoryStore((state) => state.branchPath);
  const loadedSceneIds = useAboutStoryStore((state) => state.loadedSceneIds);
  const debugEnabled = useAboutStoryStore((state) => state.debugEnabled);
  const requestedNodeId = useAboutStoryStore((state) => state.requestedNodeId);
  const setScrollMetrics = useAboutStoryStore((state) => state.setScrollMetrics);
  const setLoadedSceneIds = useAboutStoryStore((state) => state.setLoadedSceneIds);
  const setQualityMode = useAboutStoryStore((state) => state.setQualityMode);
  const goToNode = useAboutStoryStore((state) => state.goToNode);
  const enterBranch = useAboutStoryStore((state) => state.enterBranch);
  const clearRequestedNode = useAboutStoryStore((state) => state.clearRequestedNode);

  const primaryNodes = useMemo<AboutStoryNode[]>(
    () => aboutPrimaryTimelineIds.map((id) => aboutStoryNodesById[id]).filter(Boolean),
    [],
  );

  const { direction, timeline, jumpToNodeId } = useAboutStoryTimeline({
    primaryNodes,
    scrollContainerRef,
    sectionRef,
  });

  const activeRuntime = timeline.nodes[timeline.activeIndex];
  const activeNode = activeRuntime?.node ?? aboutStoryNodesById[aboutStoryInitialNodeId];

  const totalWeight = useMemo(
    () => primaryNodes.reduce((sum, node) => sum + node.scrollWeight, 0),
    [primaryNodes],
  );
  const timelineHeightVh = Math.max(560, Math.min(780, Math.round(totalWeight * 170)));

  const timelineDockProgress = useMemo(() => {
    if (timeline.transition?.fromId === aboutStoryInitialNodeId) {
      return timeline.transition.sceneMix;
    }
    return timeline.activeIndex > 0 ? 1 : 0;
  }, [timeline.activeIndex, timeline.transition]);

  useEffect(() => {
    setQualityMode(qualityMode);
  }, [qualityMode, setQualityMode]);

  useEffect(() => {
    if (!activeRuntime) return;

    setScrollMetrics({
      activeNodeId: activeRuntime.node.id,
      activeTimelineIndex: timeline.activeIndex,
      scrollProgress: timeline.smoothedProgress,
      nodeProgress: activeRuntime.nodeProgress,
      direction,
    });
  }, [activeRuntime, direction, setScrollMetrics, timeline.activeIndex, timeline.smoothedProgress]);

  useEffect(() => {
    if (!import.meta.env.DEV || !activeRuntime) {
      return;
    }

    const adjacentNode = timeline.adjacentIndex != null ? timeline.nodes[timeline.adjacentIndex]?.node ?? null : null;

    upsertRuntimeContextEntry({
      pagePath: "/about",
      id: ABOUT_RUNTIME_CONTEXT_ID,
      componentName: "AboutExperience",
      componentPath: ["AboutPage", "AboutExperience"],
      filePath: "/src/components/AboutStory/AboutExperience.tsx",
      role: "story-runtime",
      metadata: {
        activeNodeId: activeRuntime.node.id,
        activeNodeTitle: activeRuntime.node.title,
        activeNodeType: activeRuntime.node.type,
        activeIndex: timeline.activeIndex,
        adjacentNodeId: adjacentNode?.id ?? null,
        timelineProgress: Number(timeline.smoothedProgress.toFixed(4)),
        rawProgress: Number(timeline.rawProgress.toFixed(4)),
        nodeProgress: Number(activeRuntime.nodeProgress.toFixed(4)),
        timelineDockProgress: Number(timelineDockProgress.toFixed(4)),
        branchPath,
        branchHostVisible: Boolean(activeNode.branchOptions?.length),
        renderedNodeIds: timeline.renderedNodeIds,
        loadedSceneIds,
        qualityMode,
        direction,
      },
    });

    return () => {
      removeRuntimeContextEntry("/about", ABOUT_RUNTIME_CONTEXT_ID);
    };
  }, [
    activeNode.branchOptions?.length,
    activeRuntime,
    branchPath,
    direction,
    loadedSceneIds,
    qualityMode,
    timeline.adjacentIndex,
    timeline.activeIndex,
    timeline.nodes,
    timeline.rawProgress,
    timeline.renderedNodeIds,
    timeline.smoothedProgress,
    timelineDockProgress,
  ]);

  useEffect(() => {
    const warmIds = primaryNodes
      .filter((node, index) => Math.abs(index - timeline.activeIndex) <= 1 || node.unloadStrategy === "keep-warm")
      .map((node) => node.id);
    setLoadedSceneIds(warmIds);
  }, [primaryNodes, setLoadedSceneIds, timeline.activeIndex]);

  useEffect(() => {
    if (!requestedNodeId) return;
    jumpToNodeId(requestedNodeId);
    clearRequestedNode();
  }, [clearRequestedNode, jumpToNodeId, requestedNodeId]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const nx = clamp01((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = clamp01((event.clientY - rect.top) / rect.height) * 2 - 1;
    setPointer({ x: nx, y: ny });
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  return (
    <section ref={sectionRef} {...aboutExperienceProbe} className="relative" style={{ height: `${timelineHeightVh}vh` }}>
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        <div className="theme-about-story-backdrop absolute inset-0" />
        <div className="theme-about-story-haze absolute inset-0" />
        <div className="theme-about-story-grid absolute inset-0 opacity-60" />

        <CanvasErrorBoundary
          fallback={
            <div className="absolute inset-6 flex items-center justify-center rounded-[2rem] border border-slate-200/70 bg-white/80">
              <div className="max-w-sm px-6 text-center">
                <p className="text-sm font-medium text-slate-700">3D story unavailable</p>
                <p className="mt-2 text-sm text-slate-500">WebGL could not initialize, but the About route shell is still in place.</p>
              </div>
            </div>
          }
        >
          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 0.12, 6.2], fov: 36 }}
            dpr={qualityMode === "reduced" ? [1, 1.4] : [1, 1.9]}
            gl={{
              alpha: true,
              antialias: qualityMode !== "reduced",
              powerPreference: qualityMode === "reduced" ? "default" : "high-performance",
              preserveDrawingBuffer: false,
            }}
            onCreated={({ gl }) => {
              (gl as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace = THREE.SRGBColorSpace;
              THREE.ColorManagement.enabled = true;
              gl.setClearColor(0xffffff, 0);
            }}
          >
            <fog attach="fog" args={[qualityMode === "reduced" ? "#eef6ff" : "#f5f9ff", 8, 24]} />
            <ambientLight intensity={0.92} />
            <directionalLight position={[3.2, 3.1, 3.6]} intensity={1.1} />
            <directionalLight position={[-2.8, 1.4, -2.2]} intensity={0.24} />
            <pointLight position={[0, 2.6, 1.8]} intensity={qualityMode === "reduced" ? 0.42 : 0.68} color="#7dd3fc" />

            <AboutCameraRig timeline={timeline} pointer={pointer} qualityMode={qualityMode} />
            <AboutSceneController
              timeline={timeline}
              pointer={pointer}
              qualityMode={qualityMode}
              overlayState={{
                timelineDockProgress,
                branchHostVisible: Boolean(activeNode.branchOptions?.length),
                branchPath,
              }}
            />
          </Canvas>
        </CanvasErrorBoundary>

        <AboutOverlay
          activeNode={activeNode}
          primaryNodes={primaryNodes}
          timeline={timeline}
          timelineDockProgress={timelineDockProgress}
          branchPath={branchPath}
          onJumpToNode={(nodeId) => goToNode(nodeId)}
          onBranchSelect={(nodeId) => enterBranch(nodeId)}
        />

        {import.meta.env.DEV && debugEnabled && (
          <AboutDebugPanel timeline={timeline} loadedSceneIds={loadedSceneIds} branchPath={branchPath} qualityMode={qualityMode} />
        )}
      </div>
    </section>
  );
};

export default AboutExperience;
