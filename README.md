# SVA

Style Variant API for React Native. Type-safe component style variants with theme support.

Reverse-engineered from [CVA](https://cva.style) by Joe Bell — all credit for the original concept goes there.

## Installation

```bash
npm install @cstrlcs/sva
# or
bun add @cstrlcs/sva
```

## Usage

```typescript
import { sva, type VariantProps } from "@cstrlcs/sva";

const styles = sva(() => ({
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

const result = styles({ size: "sm" }, { theme: undefined });

type X = VariantProps<typeof styles>;
// { size?: "sm" | "base" | "lg" | null | undefined }
```

### With theme

```typescript
const styles = sva((theme) => ({
  base: {
    borderRadius: 4,
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: theme?.colors?.primary ?? "#007AFF",
      },
      outline: {
        borderWidth: 1,
        borderColor: theme?.colors?.primary ?? "#007AFF",
      },
    },
  },
}));

const result = styles({ variant: "primary" }, { theme: myTheme });
```

### Boolean variants

```typescript
const styles = sva(() => ({
  variants: {
    disabled: {
      true: { opacity: 0.5 },
      false: {},
    },
  },
}));

type Props = VariantProps<typeof styles>;
// { disabled?: boolean | null | undefined }
```

## API

### `sva(fn)`

- `fn`: Receives a theme object, returns `{ base?, variants }`.
- Returns an apply function: `(values, { theme?, style? }) => StylePart`
  - `style` is merged last, overriding variant styles.

### `VariantProps<T>`

Extracts variant props from a style function. Boolean variants (`"true" | "false"` keys) are typed as `boolean`.

## License

MIT
