"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";

type MovementState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
};

const DEFAULT_HEIGHT = 4;
const WALK_SPEED = 8;
const SPRINT_MULTIPLIER = 1.8;

type PlayerProps = {
  controls: MutableRefObject<PointerLockControlsImpl | null>;
};

export function Player({ controls }: PlayerProps) {
  const movement = useRef<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });
  const { camera, controls: existingControls } = useThree();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          movement.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          movement.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          movement.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          movement.current.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          movement.current.sprint = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          movement.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          movement.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          movement.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          movement.current.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          movement.current.sprint = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    camera.position.set(0, DEFAULT_HEIGHT, 8);
  }, [camera]);

  useFrame((_, delta) => {
    const activeControls =
      controls.current ??
      ((existingControls as PointerLockControlsImpl | null) ?? null);

    if (!activeControls || !activeControls.isLocked) return;

    const speed = WALK_SPEED * (movement.current.sprint ? SPRINT_MULTIPLIER : 1);
    const distance = speed * delta;

    const forward = Number(movement.current.forward) - Number(movement.current.backward);
    const strafe = Number(movement.current.right) - Number(movement.current.left);

    if (forward !== 0) {
      activeControls.moveForward(forward * distance);
    }

    if (strafe !== 0) {
      activeControls.moveRight(strafe * distance);
    }

    camera.position.set(
      camera.position.x,
      DEFAULT_HEIGHT,
      camera.position.z
    );
  });

  return null;
}
