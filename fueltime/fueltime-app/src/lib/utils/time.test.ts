/**
 * Time Utilities Tests
 */
import { describe, it, expect } from 'vitest';
import {
  formatTime12h,
  timeToMinutes,
  minutesToTime,
  getCurrentTime,
  minutesBetween,
  isBefore,
  addMinutesToTime,
  formatDuration,
  isTimeInRange,
  isWeekend,
} from './time';

describe('formatTime12h', () => {
  it('should format morning times correctly', () => {
    expect(formatTime12h('00:00')).toBe('12:00 AM');
    expect(formatTime12h('08:30')).toBe('8:30 AM');
    expect(formatTime12h('11:59')).toBe('11:59 AM');
  });

  it('should format afternoon/evening times correctly', () => {
    expect(formatTime12h('12:00')).toBe('12:00 PM');
    expect(formatTime12h('13:30')).toBe('1:30 PM');
    expect(formatTime12h('23:45')).toBe('11:45 PM');
  });
});

describe('timeToMinutes', () => {
  it('should convert time to minutes since midnight', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('01:00')).toBe(60);
    expect(timeToMinutes('12:30')).toBe(750);
    expect(timeToMinutes('23:59')).toBe(1439);
  });
});

describe('minutesToTime', () => {
  it('should convert minutes to time string', () => {
    expect(minutesToTime(0)).toBe('00:00');
    expect(minutesToTime(60)).toBe('01:00');
    expect(minutesToTime(750)).toBe('12:30');
    expect(minutesToTime(1439)).toBe('23:59');
  });

  it('should handle overflow (> 24h)', () => {
    expect(minutesToTime(1440)).toBe('00:00');
    expect(minutesToTime(1500)).toBe('01:00');
  });

  it('should handle negative minutes', () => {
    expect(minutesToTime(-60)).toBe('23:00');
    expect(minutesToTime(-120)).toBe('22:00');
  });
});

describe('getCurrentTime', () => {
  it('should return time in HH:mm format', () => {
    const time = getCurrentTime();
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('minutesBetween', () => {
  it('should calculate minutes between two times', () => {
    expect(minutesBetween('08:00', '12:00')).toBe(240);
    expect(minutesBetween('00:00', '01:00')).toBe(60);
  });

  it('should handle overnight spans', () => {
    expect(minutesBetween('23:00', '07:00')).toBe(480);
    expect(minutesBetween('22:00', '06:00')).toBe(480);
  });
});

describe('isBefore', () => {
  it('should compare times correctly', () => {
    expect(isBefore('08:00', '12:00')).toBe(true);
    expect(isBefore('12:00', '08:00')).toBe(false);
    expect(isBefore('12:00', '12:00')).toBe(false);
  });
});

describe('addMinutesToTime', () => {
  it('should add minutes to time', () => {
    expect(addMinutesToTime('08:00', 30)).toBe('08:30');
    expect(addMinutesToTime('08:00', 60)).toBe('09:00');
    expect(addMinutesToTime('08:00', 240)).toBe('12:00');
  });

  it('should handle overflow past midnight', () => {
    expect(addMinutesToTime('23:00', 120)).toBe('01:00');
  });

  it('should handle negative minutes', () => {
    expect(addMinutesToTime('08:00', -60)).toBe('07:00');
  });
});

describe('formatDuration', () => {
  it('should format whole hours', () => {
    expect(formatDuration(8)).toBe('8h');
    expect(formatDuration(10)).toBe('10h');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(8.5)).toBe('8h 30m');
    expect(formatDuration(10.25)).toBe('10h 15m');
  });
});

describe('isTimeInRange', () => {
  it('should check if time is in range', () => {
    expect(isTimeInRange('10:00', '08:00', '12:00')).toBe(true);
    expect(isTimeInRange('08:00', '08:00', '12:00')).toBe(true);
    expect(isTimeInRange('12:00', '08:00', '12:00')).toBe(true);
    expect(isTimeInRange('07:00', '08:00', '12:00')).toBe(false);
    expect(isTimeInRange('13:00', '08:00', '12:00')).toBe(false);
  });

  it('should handle overnight ranges', () => {
    expect(isTimeInRange('23:00', '22:00', '02:00')).toBe(true);
    expect(isTimeInRange('01:00', '22:00', '02:00')).toBe(true);
    expect(isTimeInRange('10:00', '22:00', '02:00')).toBe(false);
  });
});

describe('isWeekend', () => {
  it('should identify weekends', () => {
    expect(isWeekend(new Date('2024-01-06'))).toBe(true); // Saturday
    expect(isWeekend(new Date('2024-01-07'))).toBe(true); // Sunday
    expect(isWeekend(new Date('2024-01-08'))).toBe(false); // Monday
  });
});
