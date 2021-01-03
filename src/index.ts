import CalendarNotification from './CalendarNotification';
import { getProp }          from './functions';

declare const global: {
  [x: string]: any;
}

const app = new CalendarNotification(getProp('LineToken'), '明日は%title%の日です。');

global.notice          = () => app.notice();
global.removeReminders = () => app.removeReminders();
global.createTrigger =   () => app.createTrigger(22);
