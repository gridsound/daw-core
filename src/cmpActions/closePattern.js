"use strict";

DAWCore.actions.closePattern = ( type, get ) => {
	const attr = type === "keys"
			? "patternKeysOpened"
			: type === "drums"
				? "patternDrumsOpened"
				: "patternBufferOpened";

	if ( get[ attr ]() ) {
		return { [ attr ]: null };
	}
};
