# Tab Preview Component

The `Tab` component provides visual previews for browser tabs with multiple fallback options.

## Features

- **Screenshot Previews**: Uses free screenshot services to generate website thumbnails
- **Smart Favicon Display**: Shows actual site favicons from multiple sources
- **Domain Initials**: Colorful fallback with domain initials when no image is available
- **Error Handling**: Graceful fallback through multiple preview methods
- **Loading States**: Shows actual favicon while generating screenshots

## Usage

```jsx
import { Tab } from './utils/tab-manager';

// Basic usage with favicon
<Tab url="https://www.example.com" />

// With screenshot preview
<Tab url="https://www.example.com" showScreenshot={true} />
```

## Preview Methods (in order of priority)

1. **Screenshot Service**: Uses WordPress mshots API for website thumbnails
2. **Favicon Service**: Tries multiple favicon sources:
   - `/favicon.ico` (standard favicon)
   - `/apple-touch-icon.png` (high-quality icon)
   - `/apple-touch-icon-precomposed.png`
   - Google Favicon Service (fallback)
   - `/favicon-32x32.png`
   - `/favicon-16x16.png`
3. **Domain Initials**: Colorful background with domain initials

## Loading Behavior

- **While Loading**: Shows actual site favicon immediately
- **Screenshot Generation**: Displays favicon with subtle loading indicator
- **Error Fallback**: Automatically tries next favicon source on failure

## Screenshot Services

The component uses multiple free screenshot services:
- WordPress mshots API
- Microlink API
- Thum.io

## Styling

- Default size: 112x96 pixels (w-28 h-24)
- Rounded corners
- Responsive design
- Color-coded domain initials
- Subtle loading animations

## Error Handling

- Network errors fall back to next favicon source
- Invalid URLs show domain initials
- Loading states prevent layout shifts
- Progressive enhancement approach 