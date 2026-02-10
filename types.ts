
export interface UserProfile {
  username: string;
  password?: string;
  age: number;
  heightFeet: number;
  heightInches: number;
  currentWeightLbs: number;
  targetWeightLbs: number;
  calorieGoal: number;
  onboarded: boolean;
}

export type FoodGroup = 'Proteins' | 'Carbs' | 'Fats' | 'Fruits/Veg';

export interface FoodLogEntry {
  id: string;
  timestamp: number;
  mealName: string;
  calories: number;
  groups?: FoodGroup[];
}

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  activityType: string;
  durationMinutes: number;
  caloriesBurned?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AppState {
  profile: UserProfile;
  foodLogs: FoodLogEntry[];
  activityLogs: ActivityLogEntry[];
  weightHistory: { timestamp: number; weight: number }[];
  chatHistory: ChatMessage[];
}

export enum View {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  LOG_FOOD = 'LOG_FOOD',
  LOG_ACTIVITY = 'LOG_ACTIVITY',
  PROGRESS = 'PROGRESS',
  HELP = 'HELP',
  ONBOARDING = 'ONBOARDING',
  LOG_WEIGHT = 'LOG_WEIGHT',
  AI_CHAT = 'AI_CHAT'
}
