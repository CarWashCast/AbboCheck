import '@fontsource-variable/manrope';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const ID_BASE = 71000000;
const ID_RANGE = 8000000;

function notificationId(subscriptionId, offset) {
  let hash = 0;
  const value = String(subscriptionId);
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return ID_BASE + (Math.abs(hash) % (ID_RANGE - 100)) + offset;
}

function atNineAM(dateString, daysBefore) {
  const date = new Date(`${dateString}T09:00:00`);
  date.setDate(date.getDate() - daysBefore);
  return date;
}

async function requestPermission() {
  if (!Capacitor.isNativePlatform()) return 'web';
  let permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') {
    permission = await LocalNotifications.requestPermissions();
  }
  return permission.display;
}

async function sync(state) {
  if (!Capacitor.isNativePlatform()) return;
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') return;

  // Cancel only notifications owned by AbboCheck.
  const pending = await LocalNotifications.getPending();
  const ours = (pending.notifications || [])
    .filter(n => Number(n.id) >= ID_BASE && Number(n.id) < ID_BASE + ID_RANGE)
    .map(n => ({ id: n.id }));
  if (ours.length) await LocalNotifications.cancel({ notifications: ours });

  const now = new Date();
  const notifications = [];
  for (const sub of (state.subscriptions || [])) {
    if (sub.status !== 'active' || !sub.deadline) continue;
    for (const daysBefore of [7, 1]) {
      const at = atNineAM(sub.deadline, daysBefore);
      if (at <= now) continue;
      const id = notificationId(sub.id, daysBefore);
      notifications.push({
        id,
        title: daysBefore === 7 ? 'Opzegdeadline over 7 dagen' : 'Opzegdeadline morgen',
        body: `${sub.name}: uiterste opzegdatum is ${new Date(`${sub.deadline}T12:00:00`).toLocaleDateString('nl-NL')}.`,
        schedule: { at },
        extra: { subscriptionId: sub.id, deadline: sub.deadline }
      });
    }
  }
  if (notifications.length) {
    await LocalNotifications.schedule({ notifications });
  }
}

window.AbboNotifications = {
  isNative: () => Capacitor.isNativePlatform(),
  requestPermission,
  sync
};
