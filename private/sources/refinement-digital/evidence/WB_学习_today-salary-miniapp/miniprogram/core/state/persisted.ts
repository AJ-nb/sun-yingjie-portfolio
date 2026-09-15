// 本地存储统一 schema —— 纯逻辑，读写由 services/storage.ts 负责（wx 唯一出口）。

import type { DayOverride, OverrideKind } from "../calendar/day-type";
import { isOverrideKind } from "../calendar/day-type";
import { isValidDateKey, type DateKey } from "../calendar/date-key";
import { normalizeDayRecord, type DayRecord } from "../records/day-record";
import { isMood, maxNoteLength, type Mood } from "../records/mood";
import {
  normalizeOvertimeRules,
  defaultOvertimeRules,
  type OvertimeRules,
} from "../overtime/rules";
import { emptyDaySession, type DaySession, type OffDutyDecision, type RestDayChoice } from "../overtime/estimate";
import {
  defaultReminderPreferences,
  normalizeReminderPreferences,
  type ReminderPreferences,
} from "../reminders/reminders";
import {
  defaultSalaryConfig,
  type SalaryConfig,
  type SalaryType,
} from "../salary/config";
import { parseTimeToMinutes } from "../salary/time";
import { validateSalaryConfig } from "../salary/validation";
import { defaultPreferences, normalizePreferences, type Preferences } from "./preferences";

export const storageSchemaVersion = 5;
// 存储键沿用 v1 名字：键变了老用户的工资配置就丢了，键名里的产品旧称不影响功能。
export const storageKey = "today-salary:state:v1";

/** 内置年度节假日数据的版本标记（数据本体在 core/calendar/holidays.ts，可持续追加年份） */
export const builtinHolidayVersion = 1;

/** 反悔币工具状态 —— V1 只记「是否看过机制说明」，不存选择历史（隐私最小化） */
export type RegretCoinState = {
  hasSeenIntro: boolean;
};

export const defaultRegretCoinState: RegretCoinState = {
  hasSeenIntro: false,
};

/** 内置节假日数据的开关与版本 —— 具体日期不进 Storage，只存「用不用 + 哪个版本」 */
export type HolidayCalendarState = {
  useBuiltin: boolean;
  builtinVersion: number;
};

export const defaultHolidayCalendarState: HolidayCalendarState = {
  useBuiltin: true,
  builtinVersion: builtinHolidayVersion,
};

export type PersistedState = {
  schemaVersion: number;
  onboardingCompleted: boolean;
  config: SalaryConfig;
  preferences: Preferences;
  regretCoin: RegretCoinState;

  /** V2：每日固定记录（Day Record），键为 "YYYY-MM-DD"；mood / note 内嵌于此 */
  dayRecords: Record<DateKey, DayRecord>;
  /** V2：心情独立索引，便于记录无工资的休息日；Day Record 内仍保留当天快照 */
  moodRecords: Record<DateKey, Mood>;
  /** V2：短记录独立索引；内容上限与 Day Record 一致 */
  notes: Record<DateKey, string>;
  /** V2：用户对任意一天的手动覆盖（工作日 / 休息 / 法定节假日 / 调休补班 / 特殊班次） */
  dayOverrides: Record<DateKey, DayOverride>;
  /** V2：加班与节假日高级设置 */
  overtimeRules: OvertimeRules;
  /** V2：内置节假日数据开关与版本 */
  holidayCalendar: HolidayCalendarState;
  /** V2：剩余调休天数（可为 0，不做完整请假系统） */
  compTimeBalance: number;
  /** V2：提醒偏好 */
  reminderPreferences: ReminderPreferences;
  /** V2：到点确认会话（键为 "YYYY-MM-DD"） */
  daySessions: Record<DateKey, DaySession>;

  updatedAt: number;
};

export type NormalizedPersistedState = {
  state: PersistedState;
  recovered: boolean;
};

export const defaultPersistedState: PersistedState = {
  schemaVersion: storageSchemaVersion,
  onboardingCompleted: false,
  config: { ...defaultSalaryConfig, workdays: [...defaultSalaryConfig.workdays] },
  preferences: { ...defaultPreferences },
  regretCoin: { ...defaultRegretCoinState },
  dayRecords: {},
  moodRecords: {},
  notes: {},
  dayOverrides: {},
  overtimeRules: { ...defaultOvertimeRules, multipliers: { ...defaultOvertimeRules.multipliers } },
  holidayCalendar: { ...defaultHolidayCalendarState },
  compTimeBalance: 0,
  reminderPreferences: { ...defaultReminderPreferences },
  daySessions: {},
  updatedAt: 0,
};

const salaryTypes: SalaryType[] = ["monthly", "daily", "hourly"];

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isValidTime = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(parseTimeToMinutes(value));

const isWorkday = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 6;

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const normalizeWorkdays = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [...defaultSalaryConfig.workdays];

  const unique = [...new Set(value)].filter(isWorkday);
  if (unique.length <= 0) return [...defaultSalaryConfig.workdays];

  return unique.sort((a, b) => a - b);
};

function normalizeConfig(value: unknown, recoveredRef: { value: boolean }): SalaryConfig {
  const raw = (value && typeof value === "object" && !Array.isArray(value)
    ? value
    : undefined) as Partial<SalaryConfig> | undefined;

  if (!raw) {
    recoveredRef.value = true;
    return { ...defaultSalaryConfig, workdays: [...defaultSalaryConfig.workdays] };
  }

  const salaryType = salaryTypes.includes(raw.salaryType as SalaryType)
    ? (raw.salaryType as SalaryType)
    : defaultSalaryConfig.salaryType;

  const config: SalaryConfig = {
    salaryType,
    monthlySalary: isPositiveNumber(raw.monthlySalary)
      ? raw.monthlySalary
      : defaultSalaryConfig.monthlySalary,
    dailySalary: isPositiveNumber(raw.dailySalary)
      ? raw.dailySalary
      : defaultSalaryConfig.dailySalary,
    hourlyRate: isPositiveNumber(raw.hourlyRate)
      ? raw.hourlyRate
      : defaultSalaryConfig.hourlyRate,
    workDaysPerMonth: isPositiveNumber(raw.workDaysPerMonth)
      ? raw.workDaysPerMonth
      : defaultSalaryConfig.workDaysPerMonth,
    workdays: normalizeWorkdays(raw.workdays),
    startTime: isValidTime(raw.startTime) ? raw.startTime : defaultSalaryConfig.startTime,
    endTime: isValidTime(raw.endTime) ? raw.endTime : defaultSalaryConfig.endTime,
    lunchStart: isValidTime(raw.lunchStart)
      ? raw.lunchStart
      : defaultSalaryConfig.lunchStart,
    lunchEnd: isValidTime(raw.lunchEnd) ? raw.lunchEnd : defaultSalaryConfig.lunchEnd,
    enableLunchBreak: isBoolean(raw.enableLunchBreak)
      ? raw.enableLunchBreak
      : defaultSalaryConfig.enableLunchBreak,
  };

  const fields: Array<[keyof SalaryConfig, (value: unknown) => boolean]> = [
    ["salaryType", (v) => salaryTypes.includes(v as SalaryType)],
    ["workDaysPerMonth", isPositiveNumber],
    ["workdays", (v) => Array.isArray(v) && v.length > 0 && v.every(isWorkday)],
    ["startTime", isValidTime],
    ["endTime", isValidTime],
    ["lunchStart", isValidTime],
    ["lunchEnd", isValidTime],
    ["enableLunchBreak", isBoolean],
  ];

  const activeSalaryField: keyof SalaryConfig =
    salaryType === "daily" ? "dailySalary" : salaryType === "hourly" ? "hourlyRate" : "monthlySalary";
  fields.push([activeSalaryField, isPositiveNumber]);

  if (fields.some(([key, validate]) => raw[key] !== undefined && !validate(raw[key]))) {
    recoveredRef.value = true;
  }

  // 上班/下班时间相同会让核心直接判为 invalid-config，落库前先解开这对冲突。
  if (parseTimeToMinutes(config.startTime) === parseTimeToMinutes(config.endTime)) {
    config.startTime = defaultSalaryConfig.startTime;
    config.endTime = defaultSalaryConfig.endTime;
    recoveredRef.value = true;
  }

  // 午休窗口落在工时外时，createWorkSpans 会返回空 → 整日变休息日，比直接报错更糟。
  const hasInvalidLunchWindow = validateSalaryConfig(config, (key) => key).some(
    (issue) => issue.field === "workTime",
  );
  if (hasInvalidLunchWindow) {
    config.lunchStart = defaultSalaryConfig.lunchStart;
    config.lunchEnd = defaultSalaryConfig.lunchEnd;
    config.enableLunchBreak = defaultSalaryConfig.enableLunchBreak;
    recoveredRef.value = true;
  }

  return config;
}

const normalizeRegretCoin = (value: unknown): RegretCoinState => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    // v1 数据没有 regretCoin 字段：正常迁移补默认值，不算「兜底修正」。
    return { ...defaultRegretCoinState };
  }
  const raw = value as Partial<RegretCoinState>;
  return {
    hasSeenIntro:
      typeof raw.hasSeenIntro === "boolean"
        ? raw.hasSeenIntro
        : defaultRegretCoinState.hasSeenIntro,
  };
};

// ── V2 新增字段的归一化 ────────────────────────────────────────────────
// 原则：旧数据（v1/v2）没有这些字段时补默认值，绝不因为缺字段而丢掉已有配置。

const normalizeDayRecords = (value: unknown): Record<DateKey, DayRecord> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const out: Record<DateKey, DayRecord> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, raw]) => {
    if (!isValidDateKey(key)) return;
    const record = normalizeDayRecord(raw);
    if (record) out[key] = record;
  });

  return out;
};

const normalizeMoodRecords = (value: unknown): Record<DateKey, Mood> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<DateKey, Mood> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, mood]) => {
    if (isValidDateKey(key) && isMood(mood)) out[key] = mood;
  });
  return out;
};

const normalizeNotes = (value: unknown): Record<DateKey, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<DateKey, string> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, note]) => {
    if (!isValidDateKey(key) || typeof note !== "string") return;
    const normalized = note.trim().slice(0, maxNoteLength);
    if (normalized) out[key] = normalized;
  });
  return out;
};

const normalizeDayOverrides = (value: unknown): Record<DateKey, DayOverride> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const out: Record<DateKey, DayOverride> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, raw]) => {
    if (!isValidDateKey(key)) return;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;

    const kind = (raw as { kind?: unknown }).kind;
    if (!isOverrideKind(kind)) return;

    const note = (raw as { note?: unknown }).note;
    out[key] =
      kind === "special" && typeof note === "string"
        ? { kind: kind as OverrideKind, note: note.slice(0, 20) }
        : { kind: kind as OverrideKind };
  });

  return out;
};

const normalizeDaySessions = (value: unknown): Record<DateKey, DaySession> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const decisions: OffDutyDecision[] = ["none", "left", "continue"];
  const restChoices: RestDayChoice[] = ["none", "overtime", "comp"];

  const out: Record<DateKey, DaySession> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, raw]) => {
    if (!isValidDateKey(key)) return;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;

    const item = raw as Record<string, unknown>;
    const decision = decisions.includes(item.decision as OffDutyDecision)
      ? (item.decision as OffDutyDecision)
      : "none";
    const restDayChoice = restChoices.includes(item.restDayChoice as RestDayChoice)
      ? (item.restDayChoice as RestDayChoice)
      : "none";

    out[key] = {
      ...emptyDaySession,
      decision,
      ...(typeof item.decidedAt === "number" && Number.isFinite(item.decidedAt)
        ? { decidedAt: item.decidedAt }
        : {}),
      ...(typeof item.settledEndTime === "string" ? { settledEndTime: item.settledEndTime } : {}),
      settled: item.settled === true,
      queryHandled: item.queryHandled === true,
      ...(restDayChoice !== "none" ? { restDayChoice } : {}),
      ...(typeof item.lastSeenAt === "number" && Number.isFinite(item.lastSeenAt)
        ? { lastSeenAt: item.lastSeenAt }
        : {}),
    };
  });

  return out;
};

const normalizeHolidayCalendar = (value: unknown): HolidayCalendarState => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultHolidayCalendarState };
  }

  const raw = value as Partial<HolidayCalendarState>;
  return {
    useBuiltin:
      typeof raw.useBuiltin === "boolean" ? raw.useBuiltin : defaultHolidayCalendarState.useBuiltin,
    builtinVersion:
      typeof raw.builtinVersion === "number" && Number.isFinite(raw.builtinVersion)
        ? raw.builtinVersion
        : defaultHolidayCalendarState.builtinVersion,
  };
};

const normalizeCompTimeBalance = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  // 调休是极轻量的余额，限制在 -99 ~ 99 之间，防止手改数据把 UI 撑坏
  return Math.max(-99, Math.min(99, Math.round(value)));
};

/**
 * 任何来源（旧版本、手改、损坏、跨端）的数据都必须先过这里再进入运行时。
 * recovered=true 表示发生了兜底修正，界面可提示用户核对设置。
 *
 * V2 Migration：v1 / v2 的数据缺 dayRecords / overtimeRules 等字段时一律补默认值，
 * config / preferences / regretCoin / onboardingCompleted 原样保留，绝不清空。
 */
export function normalizePersistedState(value: unknown): NormalizedPersistedState {
  const raw = (value && typeof value === "object" && !Array.isArray(value)
    ? value
    : undefined) as Partial<PersistedState> | undefined;

  if (!raw) {
    return { state: { ...defaultPersistedState }, recovered: false };
  }

  const recoveredRef = { value: false };

  if (
    typeof raw.schemaVersion === "number" &&
    Number.isFinite(raw.schemaVersion) &&
    raw.schemaVersion > storageSchemaVersion
  ) {
    // 来自更新版本的数据：宁可保守重置配置，也不要用不认识的字段算钱。
    recoveredRef.value = true;
  }

  const config = normalizeConfig(raw.config, recoveredRef);
  const preferences = normalizePreferences(raw.preferences);
  const regretCoin = normalizeRegretCoin(raw.regretCoin);
  const dayRecords = normalizeDayRecords(raw.dayRecords);
  const moodRecords = normalizeMoodRecords(raw.moodRecords);
  const notes = normalizeNotes(raw.notes);
  Object.entries(dayRecords).forEach(([key, record]) => {
    if (record.mood) moodRecords[key] = record.mood;
    if (record.note) notes[key] = record.note;
  });

  const dayOverrides = normalizeDayOverrides(raw.dayOverrides);
  const daySessions = normalizeDaySessions(raw.daySessions);

  // v4 -> v5 leaves all recorded amounts untouched. We only infer the
  // lightweight source label from existing evidence and never invent a basis.
  if ((raw.schemaVersion ?? 0) < 5) {
    Object.entries(dayRecords).forEach(([key, record]) => {
      const session = daySessions[key];
      const manuallyTouched = Boolean(
        dayOverrides[key] ||
          record.usedCompTime ||
          record.mood ||
          record.note ||
          (record.endTime && record.endTime !== config.endTime) ||
          session?.restDayChoice === "comp" ||
          session?.queryHandled,
      );
      record.recordStatus = manuallyTouched ? "corrected" : "auto";
      record.calculationBasis = null;
    });
  }

  return {
    state: {
      schemaVersion: storageSchemaVersion,
      onboardingCompleted:
        typeof raw.onboardingCompleted === "boolean" ? raw.onboardingCompleted : false,
      config,
      preferences,
      regretCoin,
      dayRecords,
      moodRecords,
      notes,
      dayOverrides,
      overtimeRules: normalizeOvertimeRules(raw.overtimeRules),
      holidayCalendar: normalizeHolidayCalendar(raw.holidayCalendar),
      compTimeBalance: normalizeCompTimeBalance(raw.compTimeBalance),
      reminderPreferences: normalizeReminderPreferences(raw.reminderPreferences),
      daySessions,
      updatedAt:
        typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt)
          ? raw.updatedAt
          : 0,
    },
    recovered: recoveredRef.value,
  };
}

export function createPersistedState(
  patch: Partial<Omit<PersistedState, "schemaVersion">> = {},
  now: Date = new Date(),
): PersistedState {
  return normalizePersistedState({
    ...defaultPersistedState,
    ...patch,
    schemaVersion: storageSchemaVersion,
    updatedAt: now.getTime(),
  }).state;
}
