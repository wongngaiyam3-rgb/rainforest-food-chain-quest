import {joystickInput, normalizeInput} from './movement.js?v=controls-v1';

const movementKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const textField = target => target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || '');
export function createControls({canvas, joystick, stick, enabled, onManual, onTap, onRotate, onZoom, onStop, onShortcut, win = window, doc = document}) {
  const keys = new Set(), listeners = [];
  let joy = null, look = null, analog = {x: 0, y: 0};
  const listen = (el, type, fn, options) => { el.addEventListener(type, fn, options); listeners.push(() => el.removeEventListener(type, fn, options)); };
  const release = (element, id) => { if (id != null && element.hasPointerCapture(id)) element.releasePointerCapture(id); };
  function endJoy() {
    const id = joy?.id; joy = null; analog = {x: 0, y: 0}; stick.style.transform = ''; release(joystick, id);
  }
  function endLook() { const id = look?.id; look = null; release(canvas, id); }
  function reset() { keys.clear(); endJoy(); endLook(); }
  function stop() { reset(); onStop(); }
  listen(win, 'keydown', e => {
    if (!enabled() || textField(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (movementKeys.has(e.code)) {
      e.preventDefault();
      // After Stop / blur / closing a dialog, require a fresh press.
      if (e.repeat && !keys.has(e.code)) return;
      if (!keys.has(e.code)) { if (look) look.canTap = false; onManual(); }
      keys.add(e.code);
    } else if (e.code === 'Space' || e.code === 'Escape') {
      e.preventDefault(); if (!e.repeat) stop();
    } else if (!e.repeat && ['KeyC', 'KeyJ', 'KeyF'].includes(e.code)) onShortcut(e.code);
  });
  listen(win, 'keyup', e => keys.delete(e.code));
  listen(win, 'blur', stop);
  listen(doc, 'visibilitychange', stop);
  listen(joystick, 'pointerdown', e => {
    if (!enabled() || joy || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault(); if (look) look.canTap = false; onManual();
    const rect = joystick.getBoundingClientRect();
    joy = {id: e.pointerId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius: rect.width * .31};
    joystick.setPointerCapture(e.pointerId); moveJoy(e);
  });
  function moveJoy(e) {
    if (e.pointerId !== joy?.id) return;
    const x = e.clientX - joy.x, y = e.clientY - joy.y;
    const scale = Math.min(1, joy.radius / (Math.hypot(x, y) || 1));
    stick.style.transform = `translate(${x * scale}px,${y * scale}px)`;
    analog = joystickInput(x, y, joy.radius);
  }
  listen(joystick, 'pointermove', moveJoy);
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(joystick, type, e => { if (e.pointerId === joy?.id) endJoy(); });
  listen(canvas, 'contextmenu', e => e.preventDefault());
  listen(canvas, 'pointerdown', e => {
    if (!enabled()) return;
    if (look) { look.dragged = true; return; } // A second finger must never become a tap-to-walk.
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return;
    e.preventDefault();
    look = {id: e.pointerId, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY,
      time: e.timeStamp, dragged: false, canTap: e.button === 0 && !joy && !keys.size};
    canvas.setPointerCapture(e.pointerId);
  });
  listen(canvas, 'pointermove', e => {
    if (e.pointerId !== look?.id) return;
    if (Math.hypot(e.clientX - look.startX, e.clientY - look.startY) > 8) look.dragged = true;
    if (look.dragged) onRotate(e.clientX - look.x, e.clientY - look.y);
    look.x = e.clientX; look.y = e.clientY;
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(canvas, type, e => {
    if (e.pointerId !== look?.id) return;
    const tap = type === 'pointerup' && look.canTap && !look.dragged && !joy && !keys.size &&
      Math.hypot(e.clientX - look.startX, e.clientY - look.startY) <= 8 && e.timeStamp - look.time < 500;
    endLook();
    if (tap && enabled()) onTap(e.clientX, e.clientY);
  });
  listen(canvas, 'wheel', e => { if (enabled()) { e.preventDefault(); onZoom(e.deltaY * .008); } }, {passive: false});
  return {
    read() {
      if (!enabled()) return {x: 0, y: 0};
      if (joy) return analog;
      return normalizeInput(Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')),
        Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')));
    },
    reset, stop, destroy() { reset(); listeners.forEach(remove => remove()); }
  };
}
