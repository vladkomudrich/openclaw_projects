"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type {
  StorageData,
  UserProfile,
  UserPreferences,
  EatingWindow,
  MealLog,
  DailyTimingScore,
  CalculationInput,
  CalculationResult,
} from "@/types";
import {
  initializeStorage,
  saveStorageData,
  addMealLog as addMealLogToStorage,
  updateMealLog as updateMealLogInStorage,
  deleteMealLog as deleteMealLogFromStorage,
  completeOnboarding as completeOnboardingInStorage,
  dismissTutorial as dismissTutorialInStorage,
  saveDailyScore,
  exportData,
  importData,
  clearAllData,
} from "@/lib/storage";
import { calculateOptimalSchedule } from "@/lib/algorithms/eating-window";

// State type
interface FuelTimeState {
  isLoading: boolean;
  isInitialized: boolean;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  eatingWindow: EatingWindow | null;
  performanceZones: CalculationResult["performanceZones"] | null;
  recommendations: string[];
  mealLogs: MealLog[];
  dailyScores: DailyTimingScore[];
  onboardingCompleted: boolean;
  tutorialDismissed: boolean;
}

// Action types
type FuelTimeAction =
  | { type: "INITIALIZE"; payload: StorageData }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<UserPreferences> }
  | { type: "UPDATE_EATING_WINDOW"; payload: CalculationResult }
  | { type: "ADD_MEAL_LOG"; payload: MealLog }
  | { type: "UPDATE_MEAL_LOG"; payload: { id: string; updates: Partial<MealLog> } }
  | { type: "DELETE_MEAL_LOG"; payload: string }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "DISMISS_TUTORIAL" }
  | { type: "RESET" };

// Context type
interface FuelTimeContextType extends FuelTimeState {
  updateProfile: (profile: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  recalculateSchedule: () => void;
  addMealLog: (log: Omit<MealLog, "id">) => MealLog | null;
  updateMealLog: (id: string, updates: Partial<MealLog>) => void;
  deleteMealLog: (id: string) => void;
  completeOnboarding: () => void;
  dismissTutorial: () => void;
  exportUserData: () => string | null;
  importUserData: (jsonString: string) => boolean;
  resetAllData: () => void;
}

// Initial state
const initialState: FuelTimeState = {
  isLoading: true,
  isInitialized: false,
  profile: null,
  preferences: null,
  eatingWindow: null,
  performanceZones: null,
  recommendations: [],
  mealLogs: [],
  dailyScores: [],
  onboardingCompleted: false,
  tutorialDismissed: false,
};

// Reducer
function fuelTimeReducer(state: FuelTimeState, action: FuelTimeAction): FuelTimeState {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
        profile: action.payload.profile,
        preferences: action.payload.preferences,
        eatingWindow: action.payload.eatingWindow,
        mealLogs: action.payload.mealLogs,
        dailyScores: action.payload.dailyScores,
        onboardingCompleted: action.payload.onboardingCompleted,
        tutorialDismissed: action.payload.tutorialDismissed,
      };

    case "UPDATE_PROFILE":
      if (!state.profile) return state;
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
      };

    case "UPDATE_PREFERENCES":
      if (!state.preferences) return state;
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case "UPDATE_EATING_WINDOW":
      return {
        ...state,
        eatingWindow: action.payload.eatingWindow,
        performanceZones: action.payload.performanceZones,
        recommendations: action.payload.recommendations,
      };

    case "ADD_MEAL_LOG":
      return {
        ...state,
        mealLogs: [...state.mealLogs, action.payload],
      };

    case "UPDATE_MEAL_LOG":
      return {
        ...state,
        mealLogs: state.mealLogs.map((log) =>
          log.id === action.payload.id
            ? { ...log, ...action.payload.updates }
            : log
        ),
      };

    case "DELETE_MEAL_LOG":
      return {
        ...state,
        mealLogs: state.mealLogs.filter((log) => log.id !== action.payload),
      };

    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        onboardingCompleted: true,
      };

    case "DISMISS_TUTORIAL":
      return {
        ...state,
        tutorialDismissed: true,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// Create context
const FuelTimeContext = createContext<FuelTimeContextType | null>(null);

// Provider component
export function FuelTimeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fuelTimeReducer, initialState);

  // Initialize on mount
  useEffect(() => {
    const data = initializeStorage();
    
    // Calculate initial schedule
    if (data.profile) {
      const input: CalculationInput = {
        wakeTime: data.profile.wakeTime,
        sleepTime: data.profile.sleepTime,
        chronotype: data.profile.chronotype,
        goal: data.profile.primaryGoal,
        workSchedule: data.profile.workSchedule,
        windowDuration: data.preferences.windowDuration,
      };
      
      const result = calculateOptimalSchedule(input);
      data.eatingWindow = result.eatingWindow;
    }
    
    dispatch({ type: "INITIALIZE", payload: data });
  }, []);

  // Save to storage whenever state changes
  useEffect(() => {
    if (!state.isInitialized || !state.profile || !state.preferences || !state.eatingWindow) {
      return;
    }

    const dataToSave: StorageData = {
      version: "1.0.0",
      profile: state.profile,
      preferences: state.preferences,
      eatingWindow: state.eatingWindow,
      mealLogs: state.mealLogs,
      dailyScores: state.dailyScores,
      onboardingCompleted: state.onboardingCompleted,
      tutorialDismissed: state.tutorialDismissed,
      lastUpdated: new Date().toISOString(),
    };

    saveStorageData(dataToSave);
  }, [state]);

  // Recalculate schedule when profile or preferences change
  const recalculateSchedule = useCallback(() => {
    if (!state.profile || !state.preferences) return;

    const input: CalculationInput = {
      wakeTime: state.profile.wakeTime,
      sleepTime: state.profile.sleepTime,
      chronotype: state.profile.chronotype,
      goal: state.profile.primaryGoal,
      workSchedule: state.profile.workSchedule,
      windowDuration: state.preferences.windowDuration,
    };

    const result = calculateOptimalSchedule(input);
    dispatch({ type: "UPDATE_EATING_WINDOW", payload: result });
  }, [state.profile, state.preferences]);

  // Context methods
  const updateProfile = useCallback(
    (profile: Partial<UserProfile>) => {
      dispatch({ type: "UPDATE_PROFILE", payload: profile });
      // Recalculate after a small delay to allow state update
      setTimeout(() => recalculateSchedule(), 0);
    },
    [recalculateSchedule]
  );

  const updatePreferences = useCallback(
    (preferences: Partial<UserPreferences>) => {
      dispatch({ type: "UPDATE_PREFERENCES", payload: preferences });
      setTimeout(() => recalculateSchedule(), 0);
    },
    [recalculateSchedule]
  );

  const addMealLog = useCallback((log: Omit<MealLog, "id">): MealLog | null => {
    const newLog = addMealLogToStorage(log);
    if (newLog) {
      dispatch({ type: "ADD_MEAL_LOG", payload: newLog });
    }
    return newLog;
  }, []);

  const updateMealLog = useCallback((id: string, updates: Partial<MealLog>) => {
    updateMealLogInStorage(id, updates);
    dispatch({ type: "UPDATE_MEAL_LOG", payload: { id, updates } });
  }, []);

  const deleteMealLog = useCallback((id: string) => {
    deleteMealLogFromStorage(id);
    dispatch({ type: "DELETE_MEAL_LOG", payload: id });
  }, []);

  const completeOnboarding = useCallback(() => {
    completeOnboardingInStorage();
    dispatch({ type: "COMPLETE_ONBOARDING" });
  }, []);

  const dismissTutorial = useCallback(() => {
    dismissTutorialInStorage();
    dispatch({ type: "DISMISS_TUTORIAL" });
  }, []);

  const exportUserData = useCallback((): string | null => {
    return exportData();
  }, []);

  const importUserData = useCallback((jsonString: string): boolean => {
    const data = importData(jsonString);
    if (data) {
      dispatch({ type: "INITIALIZE", payload: data });
      return true;
    }
    return false;
  }, []);

  const resetAllData = useCallback(() => {
    clearAllData();
    const freshData = initializeStorage();
    dispatch({ type: "INITIALIZE", payload: freshData });
  }, []);

  const contextValue: FuelTimeContextType = {
    ...state,
    updateProfile,
    updatePreferences,
    recalculateSchedule,
    addMealLog,
    updateMealLog,
    deleteMealLog,
    completeOnboarding,
    dismissTutorial,
    exportUserData,
    importUserData,
    resetAllData,
  };

  return (
    <FuelTimeContext.Provider value={contextValue}>
      {children}
    </FuelTimeContext.Provider>
  );
}

// Custom hook
export function useFuelTime() {
  const context = useContext(FuelTimeContext);
  if (!context) {
    throw new Error("useFuelTime must be used within a FuelTimeProvider");
  }
  return context;
}
