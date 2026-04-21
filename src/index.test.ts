import { describe, expect, test } from "bun:test";

import { sva, type VariantProps } from "./index";

describe("sva", () => {
  describe("basic functionality", () => {
    test("should apply base styles", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
          margin: 5,
        },
        variants: {},
      }));

      const result = styles({}, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        margin: 5,
      });
    });

    test("should apply single variant", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            red: { backgroundColor: "red" },
            blue: { backgroundColor: "blue" },
          },
        },
      }));

      const result = styles({ color: "red" }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        backgroundColor: "red",
      });
    });

    test("should work without base styles", () => {
      const styles = sva(() => ({
        variants: {
          color: {
            red: { backgroundColor: "red" },
          },
        },
      }));

      const result = styles({ color: "red" }, { theme: undefined });

      expect(result).toEqual({
        backgroundColor: "red",
      });
    });
  });

  describe("variant combinations", () => {
    test("should apply multiple variants", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            red: { backgroundColor: "red" },
            blue: { backgroundColor: "blue" },
          },
          size: {
            small: { fontSize: 12 },
            large: { fontSize: 18 },
          },
        },
      }));

      const result = styles({ color: "red", size: "large" }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        backgroundColor: "red",
        fontSize: 18,
      });
    });

    test("should handle variant override conflicts", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          variant1: {
            a: { backgroundColor: "red", color: "white" },
          },
          variant2: {
            b: { backgroundColor: "blue" },
          },
        },
      }));

      const result = styles({ variant1: "a", variant2: "b" }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        backgroundColor: "blue",
        color: "white",
      });
    });
  });

  describe("boolean variants", () => {
    test("should handle true boolean variant", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          disabled: {
            true: { opacity: 0.5 },
            false: {},
          },
        },
      }));

      const result = styles({ disabled: true }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        opacity: 0.5,
      });
    });

    test("should handle false boolean variant", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          disabled: {
            true: { opacity: 0.5 },
            false: { opacity: 1 },
          },
        },
      }));

      const result = styles({ disabled: false }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        opacity: 1,
      });
    });

    test("should default to false when boolean variant is undefined", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          disabled: {
            true: { opacity: 0.5 },
            false: { opacity: 1 },
          },
        },
      }));

      const result = styles({}, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        opacity: 1,
      });
    });

    test("should handle null boolean variant as false", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          disabled: {
            true: { opacity: 0.5 },
            false: { opacity: 1 },
          },
        },
      }));

      const result = styles({ disabled: null }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        opacity: 1,
      });
    });
  });

  describe("theme support", () => {
    test("should pass theme to variant function", () => {
      const styles = sva((theme) => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            primary: { backgroundColor: theme?.colors?.primary ?? "blue" },
            secondary: { backgroundColor: theme?.colors?.secondary ?? "gray" },
          },
        },
      }));

      const theme = {
        colors: {
          primary: "#007AFF",
          secondary: "#6C757D",
        },
      };

      const result = styles({ color: "primary" }, { theme });

      expect(result).toEqual({
        padding: 10,
        backgroundColor: "#007AFF",
      });
    });

    test("should use default values when theme is undefined", () => {
      const styles = sva((theme) => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            primary: { backgroundColor: theme?.colors?.primary ?? "blue" },
          },
        },
      }));

      const result = styles({ color: "primary" }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
        backgroundColor: "blue",
      });
    });
  });

  describe("style overrides", () => {
    test("should merge custom style override", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
          backgroundColor: "red",
        },
        variants: {
          size: {
            small: { fontSize: 12 },
          },
        },
      }));

      const result = styles(
        { size: "small" },
        {
          theme: undefined,
          style: { backgroundColor: "blue", color: "white" },
        },
      );

      expect(result).toEqual({
        padding: 10,
        backgroundColor: "blue",
        fontSize: 12,
        color: "white",
      });
    });

    test("should work with undefined style override", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {},
      }));

      const result = styles({}, { theme: undefined, style: undefined });

      expect(result).toEqual({
        padding: 10,
      });
    });
  });

  describe("edge cases", () => {
    test("should handle missing variant key gracefully", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            red: { backgroundColor: "red" },
          },
        },
      }));

      // @ts-expect-error - Testing invalid variant value
      const result = styles({ color: "nonexistent" }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
      });
    });

    test("should handle undefined variant value", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            red: { backgroundColor: "red" },
            blue: { backgroundColor: "blue" },
          },
        },
      }));

      const result = styles({ color: undefined }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
      });
    });

    test("should handle null variant value", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            red: { backgroundColor: "red" },
            blue: { backgroundColor: "blue" },
          },
        },
      }));

      const result = styles({ color: null }, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
      });
    });

    test("should handle empty variants object", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {},
      }));

      const result = styles({}, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
      });
    });
  });

  describe("complex real-world scenarios", () => {
    test("should handle button component styles", () => {
      const buttonStyles = sva((theme) => ({
        base: {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
        },
        variants: {
          variant: {
            primary: {
              backgroundColor: theme?.colors?.primary ?? "#007AFF",
            },
            secondary: {
              backgroundColor: theme?.colors?.secondary ?? "#6C757D",
            },
            outline: {
              borderWidth: 1,
              borderColor: theme?.colors?.primary ?? "#007AFF",
              backgroundColor: "transparent",
            },
          },
          size: {
            small: {
              paddingHorizontal: 12,
              paddingVertical: 6,
            },
            medium: {
              paddingHorizontal: 16,
              paddingVertical: 8,
            },
            large: {
              paddingHorizontal: 20,
              paddingVertical: 12,
            },
          },
          disabled: {
            true: {
              opacity: 0.5,
            },
            false: {},
          },
        },
      }));

      const theme = {
        colors: {
          primary: "#007AFF",
          secondary: "#6C757D",
        },
      };

      const result = buttonStyles(
        { variant: "primary", size: "large", disabled: false },
        { theme },
      );

      expect(result).toEqual({
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
      });
    });
  });

  describe("type safety", () => {
    test("should extract VariantProps correctly", () => {
      const styles = sva(() => ({
        variants: {
          color: {
            red: { backgroundColor: "red" },
            blue: { backgroundColor: "blue" },
          },
          size: {
            small: { fontSize: 12 },
            large: { fontSize: 18 },
          },
          disabled: {
            true: { opacity: 0.5 },
            false: {},
          },
        },
      }));

      type Props = VariantProps<typeof styles>;

      const validProps: Props = {
        color: "red",
        size: "small",
        disabled: true,
      };

      const result = styles(validProps, { theme: undefined });

      expect(result).toEqual({
        backgroundColor: "red",
        fontSize: 12,
        opacity: 0.5,
      });
    });

    test("should allow optional variant props", () => {
      const styles = sva(() => ({
        base: {
          padding: 10,
        },
        variants: {
          color: {
            red: { backgroundColor: "red" },
          },
        },
      }));

      type Props = VariantProps<typeof styles>;

      const props: Props = {};

      const result = styles(props, { theme: undefined });

      expect(result).toEqual({
        padding: 10,
      });
    });
  });
});
