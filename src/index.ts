import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

type Style = ViewStyle | ImageStyle | TextStyle;
type StylePart = Partial<Style>;

type StyleInput = StylePart | ReadonlyArray<StyleInput> | null | undefined;

type Variant = Record<string, Record<string, StylePart>>;

interface VariantsSchema<V extends Variant = Variant> {
  base?: StylePart;
  variants: V;
}

type StringToBoolean<T> = [T] extends ["true" | "false"] ? boolean : T;
type VariantOptionValue<V> = StringToBoolean<keyof V & string>;

type VariantValues<V extends Variant> = Readonly<{
  [K in keyof V]?: VariantOptionValue<V[K]> | null | undefined;
}>;

type ThemeableFunction<V extends Variant> = (ctx: any) => VariantsSchema<V>;

type ApplyFunction<V extends Variant> = (
  values: VariantValues<V>,
  options: {
    readonly ctx?: unknown;
    readonly style?: StyleInput;
  },
) => StylePart;

type ExtractVariants<T> = {
  [K in keyof T]: StringToBoolean<keyof T[K] & string>;
};

type ParsedVariants<T> = {
  [K in keyof T]?: T[K] | null | undefined;
};

export type VariantProps<F extends ApplyFunction<any>> =
  F extends ApplyFunction<infer Variants> ? ParsedVariants<ExtractVariants<Variants>> : never;

function isStyleArray(style: StyleInput): style is ReadonlyArray<StyleInput> {
  return Array.isArray(style);
}

function flattenStyle(style: StyleInput): StylePart | undefined {
  if (style == null) {
    return undefined;
  }

  if (!isStyleArray(style)) {
    return style;
  }

  const result: Partial<ViewStyle & ImageStyle & TextStyle> = {};

  for (const item of style) {
    const computed = flattenStyle(item);
    if (computed) {
      Object.assign(result, computed);
    }
  }

  return result as StylePart;
}

export function sva<V extends Variant>(function_: ThemeableFunction<V>): ApplyFunction<V> {
  return (values, options): StylePart => {
    const { ctx, style } = options;

    const { base, variants } = function_(ctx);
    const variantStyles: StylePart[] = [];

    for (const variant of Object.keys(variants) as (keyof V)[]) {
      const optionsForVariant = variants[variant];

      const v = values[variant];
      const key: string = v == null ? "false" : String(v);

      const choice = optionsForVariant![key];

      if (!choice) {
        continue;
      }

      variantStyles.push(choice);
    }

    return flattenStyle([base, ...variantStyles, style]) ?? {};
  };
}
