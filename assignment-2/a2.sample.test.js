import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import AddEditScreen from "./screens/AddEditScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { colors } from "./constants/colors";
import { globalStyles } from "./styles/globalStyles";
import { Alert } from "react-native";

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

// Mock react-navigation dependencies
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock Date.now for consistent testing
jest.spyOn(Date, "now").mockReturnValue(1234567890);

// Mock Alert.alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("Fitness Tracker App - Assignment 2 Sample Test (80% coverage)", () => {
  let mockNavigate, mockSetOptions;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockSetOptions = jest.fn();
    jest
      .spyOn(require("@react-navigation/native"), "useNavigation")
      .mockReturnValue({
        navigate: mockNavigate,
        setOptions: mockSetOptions,
      });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.spyOn(Date, "now").mockRestore();
  });

  // --- App Setup and Navigation ---
  test("Stack.Navigator renders Home screen", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          activities={[]}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );
    expect(getByText("Fitness Tracker")).toBeTruthy();
  });

  // --- Home Screen ---
  test("Home screen has PrimaryButton 'Add New Activity' that navigates to AddEdit", async () => {
    const { getByRole } = render(
      <NavigationContainer>
        <HomeScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          activities={[]}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByRole("button", { name: "Add New Activity" }));
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("AddEdit", {});
      },
      { timeout: 2000 }
    );
  });

  test("Home screen has spacer View and FlatList with correct props", () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <HomeScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          activities={[]}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );
    expect(getByTestId("activity-list")).toBeTruthy();
    expect(getByText("Fitness Tracker")).toBeTruthy();
  });

  test("Home screen uses globalStyles.container and headerText", () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <HomeScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          activities={[]}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );
    const header = getByText("Fitness Tracker");
    expect(header).toHaveStyle(globalStyles.headerText);
    expect(getByTestId("container")).toHaveStyle(globalStyles.container);
  });

  test("globalStyles.ts defines container and headerText correctly", () => {
    expect(globalStyles.container).toEqual({
      flex: 1,
      padding: 15,
      backgroundColor: colors.background,
    });
    expect(globalStyles.headerText).toEqual({
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 10,
    });
  });

  // --- Add/Edit Screen ---
  test("AddEdit screen shows conditional header and button text", async () => {
    const { getAllByText, getByRole } = render(
      <NavigationContainer>
        <AddEditScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: {} }}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );
    const addActivityElements = getAllByText("Add Activity");
    expect(addActivityElements).toHaveLength(2); // Header and button
    expect(getByRole("button", { name: "Add Activity" })).toBeTruthy();
    await waitFor(
      () => {
        expect(mockSetOptions).toHaveBeenCalledWith({ title: "" });
      },
      { timeout: 2000 }
    );
  });

  test("AddEdit screen adds new activity and navigates to Home", async () => {
    const setActivities = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <NavigationContainer>
        <AddEditScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: {} }}
          setActivities={setActivities}
        />
      </NavigationContainer>
    );

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.press(getByRole("button", { name: "Add Activity" }));

    await waitFor(
      () => {
        expect(setActivities).toHaveBeenCalledWith(expect.any(Function));
        const newActivities = setActivities.mock.calls[0][0]([]);
        expect(newActivities).toContainEqual(
          expect.objectContaining({
            id: expect.any(String),
            type: "Running",
            duration: 20,
            calories: 200,
          })
        );
        expect(newActivities[0].id).toBeTruthy();
        expect(mockNavigate).toHaveBeenCalledWith("Home");
      },
      { timeout: 2000 }
    );
  });

  // --- Details Screen ---
  test("Details screen shows Activity Details header and DetailsCard", async () => {
    const activity = {
      id: "any-id",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const { getByText } = render(
      <NavigationContainer>
        <DetailsScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: { activity } }}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );

    expect(getByText("Activity Details")).toBeTruthy();
    expect(getByText("Type: Running")).toBeTruthy();
    expect(getByText("Duration: 20 min")).toBeTruthy();
    expect(getByText("Calories: 200 cal")).toBeTruthy();
  });

  test("Details screen Edit button navigates to AddEdit", async () => {
    const activity = {
      id: "any-id",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const { getByRole } = render(
      <NavigationContainer>
        <DetailsScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: { activity } }}
          setActivities={jest.fn()}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByRole("button", { name: "Edit" }));
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("AddEdit", { activity });
      },
      { timeout: 2000 }
    );
  });

  test("Details screen Delete button removes activity and navigates to Home", async () => {
    const activity = {
      id: "any-id",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const setActivities = jest.fn();
    const { getByRole } = render(
      <NavigationContainer>
        <DetailsScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: { activity } }}
          setActivities={setActivities}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByRole("button", { name: "Delete" }));
    await waitFor(
      () => {
        expect(setActivities).toHaveBeenCalledWith(expect.any(Function));
        expect(setActivities.mock.calls[0][0]([activity])).not.toContainEqual(
          expect.objectContaining({ id: activity.id })
        );
        expect(mockNavigate).toHaveBeenCalledWith("Home");
      },
      { timeout: 2000 }
    );
  });

  // --- Navigation Flows ---
  test("Home → Add/Edit → Home flow adds activity", async () => {
    const setActivities = jest.fn();
    const { getByRole } = render(
      <NavigationContainer>
        <HomeScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          activities={[]}
          setActivities={setActivities}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByRole("button", { name: "Add New Activity" }));

    const { getByPlaceholderText, getByRole: getByRoleAddEdit } = render(
      <NavigationContainer>
        <AddEditScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: {} }}
          setActivities={setActivities}
        />
      </NavigationContainer>
    );

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.press(getByRoleAddEdit("button", { name: "Add Activity" }));

    await waitFor(
      () => {
        expect(setActivities).toHaveBeenCalledWith(expect.any(Function));
        const newActivities = setActivities.mock.calls[0][0]([]);
        expect(newActivities).toContainEqual(
          expect.objectContaining({
            id: expect.any(String),
            type: "Running",
            duration: 20,
            calories: 200,
          })
        );
        expect(newActivities[0].id).toBeTruthy();
        expect(mockNavigate).toHaveBeenCalledWith("Home");
      },
      { timeout: 2000 }
    );
  });

  test("Home → Details flow shows activity details", async () => {
    const activity = {
      id: "any-id",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const setActivities = jest.fn();
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          activities={[activity]}
          setActivities={setActivities}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Type: Running"));

    const { getByText: getByTextDetails } = render(
      <NavigationContainer>
        <DetailsScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: { activity } }}
          setActivities={setActivities}
        />
      </NavigationContainer>
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

  test("Details → Delete → Home flow removes activity", async () => {
    const activity = {
      id: "any-id",
      type: "Running",
      duration: 20,
      calories: 200,
    };
    const setActivities = jest.fn();
    const { getByRole } = render(
      <NavigationContainer>
        <DetailsScreen
          navigation={{ navigate: mockNavigate, setOptions: mockSetOptions }}
          route={{ params: { activity } }}
          setActivities={setActivities}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByRole("button", { name: "Delete" }));
    await waitFor(
      () => {
        expect(setActivities).toHaveBeenCalledWith(expect.any(Function));
        expect(setActivities.mock.calls[0][0]([activity])).not.toContainEqual(
          expect.objectContaining({ id: activity.id })
        );
        expect(mockNavigate).toHaveBeenCalledWith("Home");
      },
      { timeout: 2000 }
    );
  });
});
