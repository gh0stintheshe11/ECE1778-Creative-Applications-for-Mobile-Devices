import { render, fireEvent, waitFor } from "@testing-library/react-native";
import App from "./App";
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

// Mock Alert.alert to capture error messages
jest.spyOn(Alert, "alert");

describe("Fitness Tracker App - Sample Test (80% coverage)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Add Activity (basic presence) ---
  test("has an Add Activity button", () => {
    const { getByText } = render(<App />);
    expect(getByText("Add Activity")).toBeTruthy();
  });

  // --- Add Activity (valid, default calories) ---
  test("adds valid activity with default calories (duration * 10)", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => {
      expect(queryByText("Running - 20 min - 200 cal")).toBeTruthy();
    });

    const typeInput = getByPlaceholderText("Activity Type (e.g., Running)");
    const durationInput = getByPlaceholderText("Duration (minutes)");
    const caloriesInput = getByPlaceholderText(
      "Calories (optional, default: duration * 10)"
    );

    // Verify form is cleared
    expect(typeInput.props.value).toBe("");
    expect(durationInput.props.value).toBe("");
    expect(caloriesInput.props.value).toBe("");
  });

  // --- Add Activity (valid, provided calories) ---
  test("adds valid activity with provided calories", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Walking"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "40");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "288"
    );
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => {
      expect(queryByText("Walking - 40 min - 288 cal")).toBeTruthy();
    });
  });

  // --- Add Activity Error Handling ---
  test("error: empty type", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "10");
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please enter an activity type"
      );
    });
  });

  test("error: type with only spaces", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "   "
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "10");
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please enter an activity type"
      );
    });
  });

  test("error: empty duration", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Duration must be a positive integer"
      );
    });
  });

  test("error: non-numeric duration (abc)", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "abc");
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Duration must be a positive integer"
      );
    });
  });

  test("error: duration = 0", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "0");
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Duration must be a positive integer"
      );
    });
  });

  test("error: negative duration (-5)", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "-5");
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Duration must be a positive integer"
      );
    });
  });

  test("error: float duration (1.23)", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "1.23");
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Duration must be a positive integer"
      );
    });
  });

  test("error: non-numeric calories (ab)", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "ab"
    );
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Calories must be a positive integer"
      );
    });
  });

  test("error: calories = 0", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "0"
    );
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Calories must be a positive integer"
      );
    });
  });

  test("error: negative calories (-1)", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "-1"
    );
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Calories must be a positive integer"
      );
    });
  });

  test("error: float calories (8.88)", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "8.88"
    );
    fireEvent.press(getByText("Add Activity"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Calories must be a positive integer"
      );
    });
  });

  // --- Update: prefill & button label ---
  test("prefills form and changes button label to Update Activity on Edit", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);

    // Add one
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "30");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "350"
    );
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => {
      fireEvent.press(getByText("Edit"));
    });

    // Prefill check
    expect(
      getByPlaceholderText("Activity Type (e.g., Running)").props.value
    ).toBe("Running");
    expect(getByPlaceholderText("Duration (minutes)").props.value).toBe("30");
    expect(
      getByPlaceholderText("Calories (optional, default: duration * 10)").props
        .value
    ).toBe("350");

    // Button label
    expect(getByText("Update Activity")).toBeTruthy();
  });

  // --- Update: change only type ---
  test("updates only type; duration & calories unchanged", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    // Add with default calories (10 -> 100)
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "10");
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => fireEvent.press(getByText("Edit")));

    // change type only
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Swimming"
    );
    fireEvent.press(getByText("Update Activity"));

    await waitFor(() => {
      expect(queryByText("Swimming - 10 min - 100 cal")).toBeTruthy();
      expect(queryByText("Running - 10 min - 100 cal")).toBeNull();
    });
  });

  // --- Update: change only duration ---
  test("updates only duration; type & calories unchanged", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    // Add with provided calories 250
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "30");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "250"
    );
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => fireEvent.press(getByText("Edit")));

    // change duration only
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "45");
    fireEvent.press(getByText("Update Activity"));

    await waitFor(() => {
      expect(queryByText("Running - 45 min - 250 cal")).toBeTruthy();
      expect(queryByText("Running - 30 min - 250 cal")).toBeNull();
    });
  });

  // --- Update: change only calories ---
  test("updates only calories; type & duration unchanged", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    // Add with default (20 -> 200)
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Running"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "20");
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => fireEvent.press(getByText("Edit")));

    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "333"
    );
    fireEvent.press(getByText("Update Activity"));

    await waitFor(() => {
      expect(queryByText("Running - 20 min - 333 cal")).toBeTruthy();
      expect(queryByText("Running - 20 min - 200 cal")).toBeNull();
    });
  });

  // --- Update: remove calories -> default to duration * 10 ---
  test("removes calories and sets it to duration * 10", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    // Add with provided calories 450; duration 40 -> default would be 400
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Cycling"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "40");
    fireEvent.changeText(
      getByPlaceholderText("Calories (optional, default: duration * 10)"),
      "450"
    );
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => fireEvent.press(getByText("Edit")));

    // clear calories to empty -> expect 400
    const caloriesInput = getByPlaceholderText(
      "Calories (optional, default: duration * 10)"
    );
    fireEvent.changeText(caloriesInput, "");
    fireEvent.press(getByText("Update Activity"));

    await waitFor(() => {
      expect(queryByText("Cycling - 40 min - 400 cal")).toBeTruthy();
      expect(queryByText("Cycling - 40 min - 450 cal")).toBeNull();
    });
  });

  // --- Display: list shows items with Edit & Delete buttons ---
  test("FlatList shows items with functional Edit and Delete buttons", async () => {
    const { getByPlaceholderText, getByText, queryAllByText } = render(<App />);

    // Add two items
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "A1"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "10");
    fireEvent.press(getByText("Add Activity"));

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "A2"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "15");
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => {
      expect(queryAllByText("Edit").length).toBeGreaterThanOrEqual(2);
      expect(queryAllByText("Delete").length).toBeGreaterThanOrEqual(2);
    });
  });

  // --- Delete: remove when not editing ---
  test("deletes activity when not editing", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "Temp"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "30");
    fireEvent.press(getByText("Add Activity"));

    await waitFor(() => {
      fireEvent.press(getByText("Delete"));
    });

    await waitFor(() => {
      expect(queryByText("Temp - 30 min - 300 cal")).toBeNull();
    });
  });

  // --- Delete: delete while editing -> form clears & list updates ---
  test("deletes the activity being edited; clears form and updates list", async () => {
    const { getByPlaceholderText, getByText, queryByText, getAllByText } =
      render(<App />);

    // Add two
    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "E1"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "25");
    fireEvent.press(getByText("Add Activity"));

    fireEvent.changeText(
      getByPlaceholderText("Activity Type (e.g., Running)"),
      "E2"
    );
    fireEvent.changeText(getByPlaceholderText("Duration (minutes)"), "35");
    fireEvent.press(getByText("Add Activity"));

    // Edit the first item
    await waitFor(() => {
      const editButtons = getAllByText("Edit");
      fireEvent.press(editButtons[0]);
    });

    // Delete the item being edited
    const deleteButtons = getAllByText("Delete");
    fireEvent.press(deleteButtons[0]);

    // Expect the edited item removed and form cleared & button back to "Add Activity"
    await waitFor(() => {
      expect(queryByText("E1 - 25 min - 250 cal")).toBeNull();

      const typeInput = getByPlaceholderText("Activity Type (e.g., Running)");
      const durationInput = getByPlaceholderText("Duration (minutes)");
      const caloriesInput = getByPlaceholderText(
        "Calories (optional, default: duration * 10)"
      );
      expect(typeInput.props.value).toBe("");
      expect(durationInput.props.value).toBe("");
      expect(caloriesInput.props.value).toBe("");
      expect(getByText("Add Activity")).toBeTruthy();
    });
  });
});
