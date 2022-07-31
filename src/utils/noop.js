"use strict";

DAWCoreUtils.$noop = () => {};
DAWCoreUtils.$isNoop = fn => !fn || fn === DAWCoreUtils.$noop;
