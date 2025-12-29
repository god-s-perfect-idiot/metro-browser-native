// Font family - only Segoe WP N
const fontFamily = {
  regular: 'SegoeWPN',
  light: 'SegoeWPNLight',
  lighter: 'SegoeWPNLighter',
  semiBold: 'SegoeWPNSemibold',
  bold: 'SegoeWPNBold'
};
// Initialize font preference - must be called before fonts are used
export const initFontPreference = async () => {
  // Always use Segoe WP N, no need to load from storage
  Object.defineProperty(fonts, 'regular', {
    value: { fontFamily: fontFamily.regular },
    writable: true,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fonts, 'light', {
    value: { fontFamily: fontFamily.light },
    writable: true,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fonts, 'semiBold', {
    value: { fontFamily: fontFamily.semiBold },
    writable: true,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fonts, 'bold', {
    value: { fontFamily: fontFamily.bold },
    writable: true,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fonts, 'lighter', {
    value: { fontFamily: fontFamily.lighter },
    writable: true,
    enumerable: true,
    configurable: true
  });
};

// Update font preference (no-op since we only use Segoe WP N)
export const updateFontPreference = async () => {
  // No-op - only Segoe WP N is used
};

// Export fonts object - always uses Segoe WP N
export const fonts = Object.create(null, {
  regular: {
    value: { fontFamily: 'SegoeWPN' },
    writable: true,
    enumerable: true,
    configurable: true
  },
  light: {
    value: { fontFamily: 'SegoeWPNLight' },
    writable: true,
    enumerable: true,
    configurable: true
  },
  semiBold: {
    value: { fontFamily: 'SegoeWPNSemibold' },
    writable: true,
    enumerable: true,
    configurable: true
  }
});