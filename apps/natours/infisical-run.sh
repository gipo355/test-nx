#!/bin/bash

# TODO: check if infisical is installed else run pnpm

# my_function() {
#   # your code goes here
#   echo "Infisical is installed, running my_function"
# }

if command -v infisical >/dev/null 2>&1; then
    # my_function
    echo "infisical is installed, running infisical pnpm"
    infisical run -- node main.js
else
    echo "infisical is not installed, exiting"
fi
