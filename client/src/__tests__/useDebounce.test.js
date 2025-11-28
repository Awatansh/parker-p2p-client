import { renderHook, act } from "@testing-library/react";
import useDebounce from "../hooks/useDebounce";
import { useState } from "react";

jest.useFakeTimers();

function useWrapper(initial) {
  const [v, setV] = useState(initial);
  const deb = useDebounce(v, 200);
  return { v, setV, deb };
}

test("useDebounce delays value", () => {
  const { result } = renderHook(() => useWrapper("a"));
  expect(result.current.deb).toBe("a");

  act(() => {
    result.current.setV("foo");
  });

  // still old until timers run
  expect(result.current.deb).toBe("a");
  act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(result.current.deb).toBe("foo");
});
