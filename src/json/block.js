"use strict";

function DAWCoreJSON_block( obj ) {
	return Object.assign( Object.seal( {
		pattern: null,
		duration: 0,
		durationEdited: false,
		selected: false,
		offset: 0,
		when: 0,
		track: null,
	} ), obj );
}
