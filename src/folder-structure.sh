#!/bin/bash

# Create main directories
mkdir -p pages/{landing,auth,dashboard}
mkdir -p components/{layout,shared}
mkdir -p hooks
mkdir -p services
mkdir -p types
mkdir -p utils

# Create placeholder files to maintain folder structure in git
touch pages/.gitkeep
touch components/layout/.gitkeep
touch components/shared/.gitkeep
touch hooks/.gitkeep
touch services/.gitkeep
touch types/.gitkeep
touch utils/.gitkeep

echo "Folder structure created successfully!"
