import test from 'node:test';
import assert from 'node:assert/strict';
import {createControls} from '../docs/controls.js';
import {WALK_SPEED, frameSeconds, joystickInput, screenToWorld, movePlayer, isWalkable, targetStep} from '../docs/movement.js';

class Surface extends EventTarget {
  style = {}; captured = new Set(); tagName = 'CANVAS';
  setPointerCapture(id) { this.captured.add(id); }
  hasPointerCapture(id) { return this.captured.has(id); }
  releasePointerCapture(id) { this.captured.delete(id); }
  getBoundingClientRect() { return {left: 0, top: 0, width: 100, height: 100}; }
}
function fixture() {
  const canvas = new Surface(), joystick = new Surface(), stick = new Surface(), win = new Surface(), doc = new Surface();
  const calls = {manual: 0, stop: 0, taps: [], rotate: []}; let enabled = true;
  const controls = createControls({canvas, joystick, stick, win, doc, enabled: () => enabled,
    onManual: () => calls.manual++, onStop: () => calls.stop++, onTap: (...p) => calls.taps.push(p), onRotate: (...p) => calls.rotate.push(p), onZoom: () => {}, onShortcut: () => {}});
  function fire(el, type, props = {}) {
    const event = new Event(type, {cancelable: true});
    for (const [key, value] of Object.entries({pointerId: 1, pointerType: 'mouse', button: 0, clientX: 50, clientY: 50, timeStamp: 100, ...props})) Object.defineProperty(event, key, {value});
    el.dispatchEvent(event); return event;
  }
  return {controls, canvas, joystick, stick, win, doc, calls, fire, pause: () => { enabled = false; controls.reset(); }};
}

test('movement covers the same distance at 60, 20 and 4 FPS', () => {
  for (const fps of [60, 20, 4]) {
    const p = {x: 0, z: 24};
    for (let i = 0; i < fps * 2; i++) movePlayer(p, {x: 0, z: -WALK_SPEED * frameSeconds(1000 / fps)}, isWalkable);
    assert.ok(Math.abs(p.z - (24 - WALK_SPEED * 2)) < 1e-8);
  }
  assert.equal(frameSeconds(60_000), .25); assert.equal(frameSeconds(-1), 0);
});
test('forward follows camera direction; diagonal speed is capped', () => {
  for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const v = screenToWorld({x: 0, y: 1}, angle);
    assert.ok(Math.abs(v.x + Math.sin(angle)) < 1e-8);
    assert.ok(Math.abs(v.z + Math.cos(angle)) < 1e-8);
    const diagonal = screenToWorld({x: 1, y: 1}, angle);
    assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.z) - 1) < 1e-8);
  }
});
test('substeps cannot tunnel through trunks or the river, and the bridge remains usable', () => {
  const solids = [{x: 0, z: 22, r: .65}], p = {x: 0, z: 24};
  movePlayer(p, {x: 0, z: -5}, (x,z) => isWalkable(x,z,solids));
  assert.ok(p.z >= 23);
  const bank = {x: 18, z: 0}; movePlayer(bank, {x: 10, z: 0}, isWalkable); assert.ok(bank.x < 21.3);
  const bridge = {x: 18, z: 4}; movePlayer(bridge, {x: 10, z: 0}, isWalkable); assert.ok(Math.abs(bridge.x - 28) < 1e-8);
  const wall = {x: 0, z: 0}; movePlayer(wall, {x: 1, z: 1}, x => x < .2); assert.ok(wall.x < .2); assert.ok(wall.z > .9);
});
test('auto-walk clamps its final step instead of oscillating around the destination', () => {
  const p = {x: 0, z: 0}, target = {x: .2, z: 0};
  movePlayer(p, targetStep(p, target, .25), () => true);
  assert.ok(Math.abs(p.x - .2) < 1e-8); assert.equal(targetStep(p, target, .25).arrived, true);
});
test('joystick has a centre dead zone and proportional speed', () => {
  assert.deepEqual(joystickInput(2, -2, 31), {x: 0, y: 0});
  const half = joystickInput(0, -15.5, 31); assert.ok(half.y > 0 && half.y < .5);
  assert.deepEqual(joystickInput(0, -100, 31), {x: 0, y: 1});
});
test('keyboard release, Stop, blur and modal reset cannot leave movement latched', () => {
  const f = fixture();
  f.fire(f.win, 'keydown', {code: 'KeyW'}); assert.equal(f.controls.read().y, 1);
  f.fire(f.win, 'keyup', {code: 'KeyW'}); assert.equal(f.controls.read().y, 0);
  f.fire(f.win, 'keydown', {code: 'KeyD'}); f.fire(f.win, 'keydown', {code: 'Space'});
  f.fire(f.win, 'keydown', {code: 'KeyD', repeat: true}); assert.equal(f.controls.read().x, 0);
  f.fire(f.win, 'keyup', {code: 'KeyD'}); f.fire(f.win, 'keydown', {code: 'KeyD'}); assert.equal(f.controls.read().x, 1);
  f.fire(f.win, 'blur'); assert.deepEqual(f.controls.read(), {x: 0, y: 0});
  f.fire(f.win, 'keydown', {code: 'KeyW'}); f.pause(); assert.deepEqual(f.controls.read(), {x: 0, y: 0});
  f.controls.destroy();
});
test('a drag returning to its starting point is never treated as a walking tap', () => {
  const f = fixture();
  f.fire(f.canvas, 'pointerdown'); f.fire(f.canvas, 'pointermove', {clientX: 100}); f.fire(f.canvas, 'pointermove'); f.fire(f.canvas, 'pointerup');
  assert.equal(f.calls.taps.length, 0); assert.ok(f.calls.rotate.length > 0);
  f.fire(f.canvas, 'pointerdown'); f.fire(f.canvas, 'pointermove', {clientX: 52}); f.fire(f.canvas, 'pointerup', {clientX: 52});
  assert.deepEqual(f.calls.taps, [[52, 50]]);
  f.controls.destroy();
});
test('right-click, pointer cancellation and two-finger gestures never start walking', () => {
  const f = fixture();
  f.fire(f.canvas, 'pointerdown', {button: 2}); f.fire(f.canvas, 'pointerup', {button: 2});
  f.fire(f.canvas, 'pointerdown'); f.fire(f.canvas, 'pointercancel');
  f.fire(f.canvas, 'pointerdown'); f.fire(f.canvas, 'pointerdown', {pointerId: 2}); f.fire(f.canvas, 'pointerup');
  assert.equal(f.calls.taps.length, 0); assert.equal(f.canvas.captured.size, 0); f.controls.destroy();
});
test('joystick and look can be held together without unintended auto-walk on release', () => {
  const f = fixture();
  f.fire(f.canvas, 'pointerdown', {pointerId: 2, pointerType: 'touch'});
  f.fire(f.joystick, 'pointerdown', {pointerType: 'touch', clientY: 15}); assert.equal(f.calls.manual, 1); assert.equal(f.controls.read().y, 1);
  f.fire(f.joystick, 'lostpointercapture'); assert.deepEqual(f.controls.read(), {x: 0, y: 0});
  f.fire(f.canvas, 'pointerup', {pointerId: 2}); assert.equal(f.calls.taps.length, 0);
  assert.equal(f.stick.style.transform, ''); f.controls.destroy();
});
