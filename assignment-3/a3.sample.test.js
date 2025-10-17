import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ActivityProvider } from "./contexts/ActivityContext";
import HomeScreen from "./app/index";
import AddEditScreen from "./app/add-edit";
import DetailsScreen from "./app/details/[id]";
import { globalStyles } from "./styles/globalStyles";
import { Alert, View } from "react-native";

// Mock Stack component to avoid context issues
const MockStack = ({ children, screenOptions }) => (
  <View testID="stack-mock">{children}</View>
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
    useGlobalSearchParams: () => ({}), // Additional mock for router context
    usePathname: () => "/index", // Mock pathname for routing context
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

// Mock Date.now for consistent testing
jest.spyOn(Date, "now").mockReturnValue(1234567890);

// Mock Alert.alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("Fitness Tracker App - Assignment 3 Sample Test (70% coverage)", () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue(mockRouter);
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.spyOn(Date, "now").mockRestore();
  });

  // --- App Setup and Context ---
  test("app/_layout.tsx renders Home screen with ActivityProvider", async () => {
    const { getByText } = render(
      <ActivityProvider>
        <MockStack>
          <HomeScreen />
        </MockStack>
      </ActivityProvider>
    );
    expect(getByText("Fitness Tracker")).toBeTruthy();
  });

  // --- Home Screen (18/22 points) ---
  test('Home screen has PrimaryButton "Add New Activity" that navigates to /add-edit', async () => {
    const { getByRole } = render(
      <ActivityProvider>
        <HomeScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByRole("button", { name: "Add New Activity" }));
    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/add-edit");
      },
      { timeout: 2000 }
    );
  });

  test("Home screen has spacer View and FlatList with correct props", () => {
    const { getByTestId, getByText } = render(
      <ActivityProvider>
        <HomeScreen />
      </ActivityProvider>
    );
    expect(getByTestId("activity-list")).toBeTruthy();
    expect(getByText("Fitness Tracker")).toBeTruthy();
    expect(getByTestId("container")).toBeTruthy();
  });

  test("Home screen uses globalStyles.container and headerText", () => {
    const { getByText, getByTestId } = render(
      <ActivityProvider>
        <HomeScreen />
      </ActivityProvider>
    );
    const header = getByText("Fitness Tracker");
    expect(header).toHaveStyle(globalStyles.headerText);
    expect(getByTestId("container")).toHaveStyle(globalStyles.container);
  });

  test("ActivityListItem navigates to details/[id] on content tap", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: jest.fn(),
        deleteActivity: jest.fn(),
      });

    const { getByText } = render(
      <ActivityProvider>
        <HomeScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByText("Type: Running"));
    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/details/1234567890");
      },
      { timeout: 2000 }
    );
  });

  // --- Add/Edit Screen (18/22 points) ---
  test("AddEdit screen shows conditional header and button text", async () => {
    const { getAllByText, getByRole } = render(
      <ActivityProvider>
        <AddEditScreen />
      </ActivityProvider>
    );
    const addActivityElements = getAllByText("Add Activity");
    expect(addActivityElements).toHaveLength(2); // Header and button
    expect(getByRole("button", { name: "Add Activity" })).toBeTruthy();
  });

  test("AddEdit screen adds new activity and navigates to Home", async () => {
    const mockAddActivity = jest.fn();
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [],
        addActivity: mockAddActivity,
        updateActivity: jest.fn(),
        deleteActivity: jest.fn(),
      });

    const { getByPlaceholderText, getByRole } = render(
      <ActivityProvider>
        <AddEditScreen />
      </ActivityProvider>
    );

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.press(getByRole("button", { name: "Add Activity" }));

    await waitFor(
      () => {
        expect(mockAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "Running",
            duration: 20,
            calories: 200,
          })
        );
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });

  test("AddEdit screen updates activity when id provided", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const mockUpdateActivity = jest.fn();
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: mockUpdateActivity,
        deleteActivity: jest.fn(),
      });
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByText, getByRole, getByPlaceholderText } = render(
      <ActivityProvider>
        <AddEditScreen />
      </ActivityProvider>
    );

    expect(getByText("Edit Activity")).toBeTruthy(); // Header
    expect(getByRole("button", { name: "Update Activity" })).toBeTruthy(); // Button
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Swimming"
    );
    fireEvent.press(getByRole("button", { name: "Update Activity" }));

    await waitFor(
      () => {
        expect(mockUpdateActivity).toHaveBeenCalledWith(
          "1234567890",
          expect.objectContaining({
            type: "Swimming",
            duration: 20,
            calories: 200,
          })
        );
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });

  // --- Details Screen (16/20 points) ---
  test("Details screen shows Activity Details header and DetailsCard", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: jest.fn(),
        deleteActivity: jest.fn(),
      });
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByText } = render(
      <ActivityProvider>
        <DetailsScreen />
      </ActivityProvider>
    );

    expect(getByText("Activity Details")).toBeTruthy();
    expect(getByText("Type: Running")).toBeTruthy();
    expect(getByText("Duration: 20 min")).toBeTruthy();
    expect(getByText("Calories: 200 cal")).toBeTruthy();
  });

  test("Details screen Edit button navigates to /add-edit", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: jest.fn(),
        deleteActivity: jest.fn(),
      });
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByRole } = render(
      <ActivityProvider>
        <DetailsScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByRole("button", { name: "Edit" }));
    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/add-edit?id=1234567890");
      },
      { timeout: 2000 }
    );
  });

  test("Details screen Delete button removes activity and navigates to Home", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const mockDeleteActivity = jest.fn();
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: jest.fn(),
        deleteActivity: mockDeleteActivity,
      });
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByRole } = render(
      <ActivityProvider>
        <DetailsScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByRole("button", { name: "Delete" }));
    await waitFor(
      () => {
        expect(mockDeleteActivity).toHaveBeenCalledWith("1234567890");
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });

  // --- Navigation Flows (16/21 points) ---
  test("Home â†’ Add/Edit â†’ Home flow adds activity", async () => {
    const mockAddActivity = jest.fn();
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [],
        addActivity: mockAddActivity,
        updateActivity: jest.fn(),
        deleteActivity: jest.fn(),
      });

    const { getByRole } = render(
      <ActivityProvider>
        <HomeScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByRole("button", { name: "Add New Activity" }));

    const { getByPlaceholderText, getByRole: getByRoleAddEdit } = render(
      <ActivityProvider>
        <AddEditScreen />
      </ActivityProvider>
    );

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.press(getByRoleAddEdit("button", { name: "Add Activity" }));

    await waitFor(
      () => {
        expect(mockAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "Running",
            duration: 20,
            calories: 200,
          })
        );
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });

  test("Home â†’ Details flow shows activity details", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: jest.fn(),
        deleteActivity: jest.fn(),
      });

    const { getByText } = render(
      <ActivityProvider>
        <HomeScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByText("Type: Running"));

    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByText: getByTextDetails } = render(
      <ActivityProvider>
        <DetailsScreen />
      </ActivityProvider>
    );

    await waitFor(
      () => {
        expect(getByTextDetails("Activity Details")).toBeTruthy();
        expect(getByTextDetails("Type: Running")).toBeTruthy();
        expect(getByTextDetails("Duration: 20 min")).toBeTruthy();
        expect(getByTextDetails("Calories: 200 cal")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  test("Details â†’ Delete â†’ Home flow removes activity", async () => {
    const activity = {
      id: "1234567890",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const mockDeleteActivity = jest.fn();
    jest
      .spyOn(require("./contexts/ActivityContext"), "useActivities")
      .mockReturnValue({
        activities: [activity],
        addActivity: jest.fn(),
        updateActivity: jest.fn(),
        deleteActivity: mockDeleteActivity,
      });
    jest
      .spyOn(require("expo-router"), "useLocalSearchParams")
      .mockReturnValue({ id: "1234567890" });

    const { getByRole } = render(
      <ActivityProvider>
        <DetailsScreen />
      </ActivityProvider>
    );

    fireEvent.press(getByRole("button", { name: "Delete" }));
    await waitFor(
      () => {
        expect(mockDeleteActivity).toHaveBeenCalledWith("1234567890");
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });
});