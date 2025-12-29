#!/bin/bash

# Create a minimal source.properties file for the corrupted NDK
# This is a temporary workaround until you can properly download the NDK

NDK_PATH="$HOME/Library/Android/sdk/ndk/27.1.12297006"
SOURCE_PROPS="$NDK_PATH/source.properties"

if [ -d "$NDK_PATH" ] && [ ! -f "$SOURCE_PROPS" ]; then
    echo "Creating minimal source.properties file for corrupted NDK..."
    cat > "$SOURCE_PROPS" << 'EOF'
Pkg.Desc = Android NDK
Pkg.Revision = 27.1.12297006
EOF
    echo "✓ Created $SOURCE_PROPS"
    echo ""
    echo "NOTE: This is a temporary workaround. You should still properly download the NDK:"
    echo "  1. Remove: rm -rf $NDK_PATH"
    echo "  2. Download via Android Studio: Tools > SDK Manager > SDK Tools > NDK (Side by side) > 27.1.12297006"
else
    if [ -f "$SOURCE_PROPS" ]; then
        echo "source.properties already exists at $SOURCE_PROPS"
    else
        echo "NDK directory not found at $NDK_PATH"
    fi
fi

