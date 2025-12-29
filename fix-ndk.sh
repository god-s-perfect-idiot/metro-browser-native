#!/bin/bash

# Script to fix corrupted NDK installation
# This removes the incomplete NDK and lets it be re-downloaded

NDK_PATH="$HOME/Library/Android/sdk/ndk/27.1.12297006"

echo "Checking NDK installation..."

if [ -d "$NDK_PATH" ]; then
    if [ ! -f "$NDK_PATH/source.properties" ]; then
        echo "NDK installation is incomplete (missing source.properties)"
        echo "Removing corrupted NDK directory..."
        rm -rf "$NDK_PATH"
        echo "✓ Corrupted NDK removed: $NDK_PATH"
        echo ""
        echo "Next steps to download the NDK:"
        echo ""
        echo "Option 1 - Android Studio (Recommended):"
        echo "  1. Open Android Studio"
        echo "  2. Go to Tools > SDK Manager > SDK Tools"
        echo "  3. Check 'Show Package Details'"
        echo "  4. Expand 'NDK (Side by side)'"
        echo "  5. Check version 27.1.12297006"
        echo "  6. Click Apply to download"
        echo ""
        echo "Option 2 - Command line:"
        echo "  \$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \"ndk;27.1.12297006\""
        echo ""
        echo "After downloading, run: cd android && ./gradlew app:bundleRelease"
    else
        echo "✓ NDK installation looks good!"
    fi
else
    echo "NDK directory not found. It will be downloaded on next build or via Android Studio."
fi

