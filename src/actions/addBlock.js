"use strict";

function DAWCoreActions_addBlock( daw, patType, patId, when, track ) {
	return DAWCoreActionsCommon_addPatternBuffer( daw, patType, patId )
		.then( ( [ patId, patName, patObj ] ) => {
			const nId = DAWCoreActionsCommon_getNextIdOf( daw.$getBlocks() );
			const objBlc = DAWCoreJSON_block( {
				pattern: patId,
				when,
				track,
				duration: patObj
					? patObj.patterns[ patId ].duration
					: daw.$getPatternDuration( patId ),
			} );
			const obj = { blocks: { [ nId ]: objBlc } };
			const dur = DAWCoreActionsCommon_calcNewDuration( daw, obj );

			if ( dur !== daw.$getDuration() ) {
				obj.duration = dur;
			}
			return [
				Object.assign( obj, patObj ),
				[ "blocks", "addBlock", patName ],
			];
		} );
}
