# @maptimy/platform-formatters

A platform-agnostic library for formatting distances and durations in a localized way. Currently supports Web and React Native platforms.

## Installation

```bash
npm install @maptimy/platform-formatters
```

## Usage

### Duration Formatter

The duration formatter converts seconds into a human-readable format.

```typescript
import { LocalizedDurationFormatter } from '@maptimy/platform-formatters';

const durationFormatter = LocalizedDurationFormatter();
durationFormatter.format(3665); // Output: "1h 1m 5s"
```

### Distance Formatter

The distance formatter converts meters into localized distance strings in either meters or kilometers.

```typescript
import { LocalizedDistanceFormatter } from '@maptimy/platform-formatters';

const distanceFormatter = LocalizedDistanceFormatter();
distanceFormatter.format(1500); // Output: "1.5km"
distanceFormatter.format(500);  // Output: "500m"
```

## License

BSD 3-Clause License. See [LICENSE](LICENSE) for details.
