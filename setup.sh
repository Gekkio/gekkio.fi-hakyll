#!/bin/bash

set -aeo pipefail

cabal sandbox init
cabal install hakyll --force-reinstalls
