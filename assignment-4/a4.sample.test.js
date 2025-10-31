import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { loadActivities } from "./storage/activitiesStorage";
import activitiesReducer, {
  setActivities,
} from "./features/activities/activitiesSlice";
import HomeScreen from "./app/index";
import AddEditScreen from "./app/add-edit";
import DetailsScreen from "./app/details/[id]";
import { Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock the AsyncStorage for testing
jest.mock("@react-native-async-storage/async-storage", () => {
  const mockAsyncStorage = require("@react-native-async-storage/async-storage/jest/async-storage-mock");
  return mockAsyncStorage;
});

// Mock Stack component to avoid full navigation stack issues
const MockStack = ({ children, screenOptions }) => (
  <View testID="stack-mock" style={{ flex: 1 }}>
    {children}
  </View>
);

// Mock expo-router dependencies
jest.mock("expo-router", () => {
  const actualRouter = jest.requireActual("expo-router");
  return {
    ...actualRouter,
    Stack: MockStack,
    useRouter: () => ({
      push: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    useLinkPreviewContext: () => ({}),
    useGlobalSearchParams: () => ({}),
    usePathname: () => "/index",
  };
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

// Mock Date.now for consistent ID generation across all tests
let dateNowMock;
beforeAll(() => {
  dateNowMock = jest.spyOn(Date, "now").mockReturnValue(1234567890);
});

afterAll(() => {
  dateNowMock.mockRestore();
});

// Mock Alert.alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("Fitness Tracker App - Assignment 4 Sample Test (70% coverage)", () => {
  let mockRouter;
  let testStore;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue(mockRouter);
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({});
    jest.clearAllMocks();

    // Create a test store for each test
    testStore = configureStore({
      reducer: {
        activities: activitiesReducer,
      },
    });

    // Clear AsyncStorage before each test
    AsyncStorage.clear();
  });

  test("app/_layout.tsx renders Home screen with Redux Provider", async () => {
    const { getByText } = render(
      <Provider store={testStore}>
        <MockStack>
          <HomeScreen />
        </MockStack>
      </Provider>
    );
    expect(getByText("Fitness Tracker")).toBeTruthy();
  });

  test('Home screen has PrimaryButton "Add New Activity" that navigates to /add-edit', async () => {
    const { getByRole } = render(
      <Provider store={testStore}>
        <HomeScreen />
      </Provider>
    );

    fireEvent.press(getByRole("button", { name: "Add New Activity" }));
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/add-edit");
    });
  });

  test("Home screen has FlatList with correct props when empty", () => {
    const { getByTestId, getByText } = render(
      <Provider store={testStore}>
        <HomeScreen />
      </Provider>
    );
    expect(getByTestId("activity-list")).toBeTruthy();
    expect(getByText("Fitness Tracker")).toBeTruthy();
    expect(getByTestId("container")).toBeTruthy();
  });

  test("AddEdit screen adds new activity, updates UI, and persists to AsyncStorage", async () => {
    const { getByPlaceholderText, getByRole, queryByText } = render(
      <Provider store={testStore}>
        <AddEditScreen />
      </Provider>
    );

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    // Leave calories empty (defaults to 200)

    fireEvent.press(getByRole("button", { name: "Add Activity" }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"type":"Running"')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"duration":20')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"calories":200')
      );
    });

    // Re-render Home to check UI update
    const { getByText: homeGetByText } = render(
      <Provider store={testStore}>
        <HomeScreen />
      </Provider>
    );
    await waitFor(() => {
      expect(homeGetByText("Type: Running")).toBeTruthy();
      expect(homeGetByText("Duration: 20 min")).toBeTruthy();
      expect(homeGetByText("Calories: 200 cal")).toBeTruthy();
    });
  });

  test("AddEdit screen adds second activity with explicit calories and persists", async () => {
    // First add to have data
    const firstAdd = render(
      <Provider store={testStore}>
        <AddEditScreen />
      </Provider>
    );
    fireEvent.changeText(
      firstAdd.getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(
      firstAdd.getByPlaceholderText("Duration (minutes)"),
      "20"
    );
    fireEvent.press(firstAdd.getByRole("button", { name: "Add Activity" }));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1));

    // Second add
    const { getByPlaceholderText, getByRole } = render(
      <Provider store={testStore}>
        <AddEditScreen />
      </Provider>
    );

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Walking"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "30");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "211"
    );

    fireEvent.press(getByRole("button", { name: "Add Activity" }));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"type":"Walking"')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"duration":30')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"calories":211')
      );
    });
  });

  test("Load activities after 'restart'", async () => {
    // Simulate save from previous adds
    const savedActivities = [
      { id: "1234567890", type: "Running", duration: 20, calories: 200 },
      { id: "1234567891", type: "Walking", duration: 30, calories: 211 },
    ];
    await AsyncStorage.setItem(
      "@FitnessTracker_activities",
      JSON.stringify(savedActivities)
    );

    // Manually simulate the useEffect load: call loadActivities and dispatch
    const loadedActivities = await loadActivities();
    testStore.dispatch(setActivities(loadedActivities));

    // Wait for (immediate) dispatch and check state
    expect(testStore.getState().activities.loaded).toBe(true);
    expect(testStore.getState().activities.activities).toEqual(savedActivities);
  });

  test("Details screen shows activity details and Edit/Delete buttons", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    testStore.dispatch({
      type: "activities/setActivities",
      payload: [activity],
    });

    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByText, getByTestId } = render(
      <Provider store={testStore}>
        <DetailsScreen />
      </Provider>
    );

    expect(getByText("Activity Details")).toBeTruthy();
    expect(getByText("Type: Running")).toBeTruthy();
    expect(getByText("Duration: 20 min")).toBeTruthy();
    expect(getByText("Calories: 200 cal")).toBeTruthy();
    expect(getByTestId("edit-button")).toBeTruthy();
    expect(getByTestId("delete-button")).toBeTruthy();
  });

  test("Details → Edit flow pre-fills AddEdit screen and updates on submit", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    testStore.dispatch({
      type: "activities/setActivities",
      payload: [activity],
    });

    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByTestId: detailsGetByTestId } = render(
      <Provider store={testStore}>
        <DetailsScreen />
      </Provider>
    );

    fireEvent.press(detailsGetByTestId("edit-button"));
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/add-edit?id=1234567890");
    });

    // Render AddEdit with id
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });
    const {
      getByPlaceholderText,
      getByText,
      getByRole: addEditGetByRole,
    } = render(
      <Provider store={testStore}>
        <AddEditScreen />
      </Provider>
    );

    expect(getByText("Edit Activity")).toBeTruthy();
    // Check prefill (note: value is in props, but for TextInput, use .props.value)
    const typeInput = getByPlaceholderText("Activity Type (e.g., Running)");
    const durationInput = getByPlaceholderText("Duration (minutes)");
    const caloriesInput = getByPlaceholderText(
      "Calories (optional, default: duration * 10)"
    );
    expect(typeInput.props.value).toBe("Running");
    expect(durationInput.props.value).toBe("20");
    expect(caloriesInput.props.value).toBe("200");

    fireEvent.changeText(typeInput, "Swimming");
    fireEvent.press(addEditGetByRole("button", { name: "Update Activity" }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"type":"Swimming"')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"duration":20')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"calories":200')
      );
    });

    // Re-render Home to check UI
    const { getByText: homeGetByText } = render(
      <Provider store={testStore}>
        <HomeScreen />
      </Provider>
    );
    await waitFor(() => {
      expect(homeGetByText("Type: Swimming")).toBeTruthy();
      expect(homeGetByText("Duration: 20 min")).toBeTruthy();
      expect(homeGetByText("Calories: 200 cal")).toBeTruthy();
    });
  });

  test("Details → Delete flow removes activity, updates UI, and persists", async () => {
    const activities = [
      { id: "1234567890", type: "Swimming", duration: 20, calories: 200 },
      { id: "1234567891", type: "Walking", duration: 30, calories: 211 },
    ];
    testStore.dispatch({
      type: "activities/setActivities",
      payload: activities,
    });

    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByTestId } = render(
      <Provider store={testStore}>
        <DetailsScreen />
      </Provider>
    );

    // Mock Alert confirm (press directly dispatches since no confirm)
    fireEvent.press(getByTestId("delete-button"));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.not.stringContaining('"id":"1234567890"')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@FitnessTracker_activities",
        expect.stringContaining('"id":"1234567891"')
      );
    });

    // Re-render Home to check UI: only Walking remains
    const { queryByText, getByText } = render(
      <Provider store={testStore}>
        <HomeScreen />
      </Provider>
    );
    await waitFor(() => {
      expect(queryByText("Type: Swimming")).toBeNull();
      expect(getByText("Type: Walking")).toBeTruthy();
      expect(getByText("Duration: 30 min")).toBeTruthy();
      expect(getByText("Calories: 211 cal")).toBeTruthy();
    });
  });
});
