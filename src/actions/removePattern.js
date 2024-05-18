"use strict";

DAWCoreActions.set( "removePattern", ( daw, patId ) => {
	const pat = daw.$getPattern( patId );
	const type = pat.type;
	const obj = { patterns: { [ patId ]: undefined } };
	const blocks = Object.entries( daw.$getBlocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
		if ( blc.pattern === patId ) {
			blocks[ blcId ] = undefined;
		}
		return blocks;
	}, {} );

	if ( type !== "buffer" ) {
		obj[ type ] = { [ pat[ type ] ]: undefined };
	} else {
		GSUforEach( daw.$getDrumrows(), ( rowId, row ) => {
			if ( row.pattern === patId ) {
				GSUdeepAssign( obj, DAWCoreActions._removeDrumrow( obj, rowId, daw ) );
			}
		} );
		GSUforEach( daw.$getPatterns(), ( patSliId, patSli ) => {
			if ( patSli.type === "slices" && patSli.source === patId ) {
				obj.patterns[ patSliId ] = { source: null };
			}
		} );
		GSUaddIfNotEmpty( obj, "synths", GSUreduce( daw.$getSynths(), ( syns, synId, syn ) => {
			GSUforEach( syn.oscillators, ( oscId, osc ) => {
				if ( osc.source === patId ) {
					syns[ synId ] ||= { oscillators: {} };
					syns[ synId ].oscillators[ oscId ] = undefined;
				}
			} );
			return syns;
		}, {} ) );
		obj.buffers = { [ pat.buffer ]: undefined };
	}
	if ( GSUisntEmpty( blocks ) ) {
		const realDur = Object.values( daw.$getBlocks() )
			.reduce( ( dur, blc ) => {
				return blc.pattern === patId
					? dur
					: Math.max( dur, blc.when + blc.duration );
			}, 0 );
		const bPM = daw.$getBeatsPerMeasure();
		const dur = Math.max( 1, Math.ceil( realDur / bPM ) ) * bPM;

		obj.blocks = blocks;
		if ( dur !== daw.$getDuration() ) {
			obj.duration = dur;
		}
	}
	if ( patId === daw.$getOpened( type ) ) {
		const found = Object.entries( daw.$getPatterns() )
			.find( ( [ k, v ] ) => k !== patId && v.type === type && v.synth === pat.synth );

		obj[ DAWCoreActionsCommon_patternOpenedByType[ type ] ] = found ? found[ 0 ] : null;
	}
	return [
		obj,
		[ "patterns", "removePattern", pat.type, pat.name ],
	];
} );
