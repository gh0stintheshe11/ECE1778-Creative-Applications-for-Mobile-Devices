import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type Activity = {
  id: string;
  type: string;
  duration: number;
  calories: number;
};

export type RootStackParamList = {
  Home: undefined; 
  AddEdit: { activity?: Activity } | undefined;
  Details: { activity: Activity };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
