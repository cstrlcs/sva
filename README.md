# SVA

Style Variance Authority for React Native. Type-safe component style variants with context support.

Heavily inspired by [CVA](https://github.com/joe-bell/cva) — all credit for the original concept and part of the typing system goes there.

## Installation

```bash
npm install @cstrlcs/sva
```

## Usage

```typescript
import { sva, type VariantProps } from "@cstrlcs/sva";

const buttonVariants = sva(() => ({
  base: {
    backgroundColor: "red",
  },
  variants: {
    size: {
      sm: {
        padding: 8,
      },
      base: {
        padding: 10,
      },
      lg: {
        padding: 12,
      },
    },
  },
}));

type Props = VariantProps<typeof buttonVariants>;
// { size?: "sm" | "base" | "lg" | null | undefined }

export function MyComponent() {
  const buttonVariantsStyle = buttonVariants({ size: "sm" }, { ctx: undefined });
}
```

### With context

```typescript
const buttonVariants = sva(([theme, insets]: [Theme, EdgeInsets]) => ({
  base: {
    borderRadius: 4,
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: theme.colors.primary,
        paddingTop: Math.max(insets.top, theme.spacing.base),
      },
      outline: {
        borderWidth: 1,
      },
    },
  },
}));

export function MyComponent() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const buttonVariantsStyle = buttonVariants({ variant: "primary" }, { ctx: [theme, insets] });
}
```

### Boolean variants

```typescript
const buttonVariants = sva(() => ({
  variants: {
    disabled: {
      true: { opacity: 0.5 },
      false: {},
    },
  },
}));

type Props = VariantProps<typeof buttonVariants>;
// { disabled?: boolean | null | undefined }
```
