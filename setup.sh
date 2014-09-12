#!/bin/bash

set -euo pipefail

cabal sandbox init
cabal install hakyll --force-reinstalls
