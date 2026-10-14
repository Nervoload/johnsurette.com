import { RefObject, useEffect, useRef } from "react";
import type { LivingPointerState } from "./sceneTypes";

const DRAG_THRESHOLD_PX = 5;
const TAP_ENGAGE_MS = 3000;
const MAX_YAW = (35 * Math.PI) / 180;
const MAX_PITCH = (15 * Math.PI) / 180;

export const createPointerState = (): LivingPointerState => ({
  ndcX: 0,
  ndcY: 0,
  slotX: 0,
  slotY: 0,
  hover: false,
  pressed: false,
  dragging: false,
  focus: false,
  orbitYaw: 0,
  orbitPitch: 0,
  engagedUntil: 0,
  clicks: [],
});

interface ScenePointerOptions {
  hitRef: RefObject<HTMLElement>;
  canvasAreaRef: RefObject<HTMLElement>;
  /** Orbit by dragging (mouse/pen only; touch keeps vertical scrolling). */
  allowOrbit: boolean;
  onEngage?: () => void;
}

/**
 * Pointer handling for a living scene. Everything lands in a mutable object so moving the mouse
 * never re-renders React or the R3F tree.
 */
export const useScenePointer = ({ hitRef, canvasAreaRef, allowOrbit, onEngage }: ScenePointerOptions) => {
  const stateRef = useRef<LivingPointerState>(createPointerState());

  useEffect(() => {
    const hit = hitRef.current;
    if (!hit) return;
    const state = stateRef.current;
    let downX = 0;
    let downY = 0;
    let downYaw = 0;
    let downPitch = 0;
    let activePointer: number | null = null;
    let pointerType = "mouse";

    const updatePosition = (event: PointerEvent) => {
      const area = canvasAreaRef.current?.getBoundingClientRect();
      if (area && area.width > 0 && area.height > 0) {
        state.ndcX = ((event.clientX - area.left) / area.width) * 2 - 1;
        state.ndcY = -(((event.clientY - area.top) / area.height) * 2 - 1);
      }
      const slot = hit.getBoundingClientRect();
      if (slot.width > 0 && slot.height > 0) {
        state.slotX = Math.max(-1, Math.min(1, ((event.clientX - slot.left) / slot.width) * 2 - 1));
        state.slotY = Math.max(-1, Math.min(1, -(((event.clientY - slot.top) / slot.height) * 2 - 1)));
      }
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        state.hover = true;
        onEngage?.();
      }
      updatePosition(event);
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") state.hover = false;
      if (!state.pressed) {
        state.slotX = 0;
        state.slotY = 0;
      }
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      pointerType = event.pointerType;
      activePointer = event.pointerId;
      state.pressed = true;
      state.dragging = false;
      downX = event.clientX;
      downY = event.clientY;
      downYaw = state.orbitYaw;
      downPitch = state.orbitPitch;
      updatePosition(event);
      if (pointerType !== "touch") hit.setPointerCapture(event.pointerId);
      onEngage?.();
    };
    const onMove = (event: PointerEvent) => {
      updatePosition(event);
      if (!state.pressed || event.pointerId !== activePointer) return;
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (!state.dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX && allowOrbit && pointerType !== "touch") {
        state.dragging = true;
      }
      if (state.dragging) {
        const rect = hit.getBoundingClientRect();
        state.orbitYaw = Math.max(-MAX_YAW, Math.min(MAX_YAW, downYaw + (dx / Math.max(rect.width, 1)) * 1.6));
        state.orbitPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, downPitch + (dy / Math.max(rect.height, 1)) * 0.9));
      }
    };
    const release = (event: PointerEvent, cancelled: boolean) => {
      if (event.pointerId !== activePointer) return;
      if (!cancelled && !state.dragging) {
        updatePosition(event);
        state.clicks.push({ ndcX: state.ndcX, ndcY: state.ndcY, touch: pointerType === "touch" });
        if (state.clicks.length > 8) state.clicks.shift();
      }
      if (pointerType === "touch") state.engagedUntil = performance.now() + TAP_ENGAGE_MS;
      state.pressed = false;
      state.dragging = false;
      activePointer = null;
      if (hit.hasPointerCapture?.(event.pointerId)) hit.releasePointerCapture(event.pointerId);
    };
    const onUp = (event: PointerEvent) => release(event, false);
    const onCancel = (event: PointerEvent) => release(event, true);

    hit.addEventListener("pointerenter", onEnter);
    hit.addEventListener("pointerleave", onLeave);
    hit.addEventListener("pointerdown", onDown);
    hit.addEventListener("pointermove", onMove);
    hit.addEventListener("pointerup", onUp);
    hit.addEventListener("pointercancel", onCancel);
    return () => {
      hit.removeEventListener("pointerenter", onEnter);
      hit.removeEventListener("pointerleave", onLeave);
      hit.removeEventListener("pointerdown", onDown);
      hit.removeEventListener("pointermove", onMove);
      hit.removeEventListener("pointerup", onUp);
      hit.removeEventListener("pointercancel", onCancel);
    };
  }, [allowOrbit, canvasAreaRef, hitRef, onEngage]);

  return stateRef;
};

export const isPointerEngaged = (state: LivingPointerState): boolean =>
  state.hover || state.pressed || state.dragging || state.focus || performance.now() < state.engagedUntil;
