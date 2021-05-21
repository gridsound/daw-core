"use strict";

DAWCore.utils.noop = () => {};
DAWCore.utils.isNoop = fn => !fn || fn === DAWCore.utils.noop;
