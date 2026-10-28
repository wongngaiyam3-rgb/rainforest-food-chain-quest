// Movement distances use elapsed seconds; collision checks stay small even on slow frames.
export const WALK_SPEED = 3.8;
export function frameSeconds(milliseconds) {
  return Math.max(0, Math.min(milliseconds / 1000, 0.25));
}
export function normalizeInput(x, y) {
  const length = Math.max(1, Math.hypot(x, y));
  return {x: x / length, y: y / length};
}
export function joystickInput(x, y, radius, deadZone = 0.16) {
  const length = Math.hypot(x, y), amount = Math.min(1, length / radius);
  if (amount <= deadZone || !length) return {x: 0, y: 0};
  const strength = (amount - deadZone) / (1 - deadZone);
  return {x: x / length * strength, y: -y / length * strength};
}
export function screenToWorld(input, angle) {
  const {x, y} = normalizeInput(input.x, input.y);
  return {x: Math.cos(angle) * x - Math.sin(angle) * y,
    z: -Math.sin(angle) * x - Math.cos(angle) * y};
}
export function isWalkable(x, z, solids = []) {
  if (Math.abs(x) > 32 || Math.abs(z) > 33) return false;
  const riverX = 23 + Math.sin(z * .11) * 2;
  if (Math.abs(x - riverX) < 1.8 && Math.abs(z - 4) > 1.6) return false;
  return !solids.some(s => Math.hypot(x - s.x, z - s.z) < s.r + .35);
}
export function movePlayer(position, delta, valid) {
  const start = {x: position.x, z: position.z};
  const steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.z) / .12));
  const dx = delta.x / steps, dz = delta.z / steps;
  for (let i = 0; i < steps; i++) {
    if (valid(position.x + dx, position.z + dz)) {
      position.x += dx; position.z += dz;
    } else {
      // Slide along an obstacle rather than cancelling both directions.
      if (valid(position.x + dx, position.z)) position.x += dx;
      if (valid(position.x, position.z + dz)) position.z += dz;
    }
  }
  return Math.hypot(position.x - start.x, position.z - start.z);
}
export function targetStep(position, target, dt) {
  const x = target.x - position.x, z = target.z - position.z;
  const distance = Math.hypot(x, z);
  if (distance <= .15) return {x: 0, z: 0, arrived: true};
  const scale = Math.min(distance, WALK_SPEED * dt) / distance;
  return {x: x * scale, z: z * scale, arrived: false};
}
