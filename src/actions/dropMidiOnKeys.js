"use strict";

DAWCoreActions.dropMidiOnKeys = ( daw, patId, midiRaw ) => {
	const mid = gswaMIDIParser.$parse( midiRaw );
	const keys = gswaMIDIToKeys.$convert( mid );
	const keys0 = keys.keys[ 0 ];
	const newName = keys.patterns[ 0 ].name;
	const newDur = keys.patterns[ 0 ].duration;
	const pat = daw.$getPattern( patId );
	const keysOri = daw.$getKeys( pat.keys );
	const obj = {};

	for ( let k in keys0 ) {
		keys0[ k ] = DAWCoreJSON.key( keys0[ k ] );
	}

	const keysDiff = GSUdiffObjects( keysOri, keys0 );

	if ( keysDiff ) {
		obj.keys = { [ pat.keys ]: keysDiff };
	}
	if ( pat.duration !== newDur || pat.name !== newName ) {
		const patObj = {};

		obj.patterns = { [ patId ]: patObj };
		if ( pat.name !== newName ) {
			patObj.name = newName;
		}
		if ( pat.duration !== newDur ) {
			DAWCoreActionsCommon_updatePatternDuration( daw, obj, patId, newDur );
		}
	}
	if ( GSUisntEmpty( obj ) ) {
		return [
			obj,
			[ "keys", "dropMidiOnKeys", newName ],
		];
	}
};
