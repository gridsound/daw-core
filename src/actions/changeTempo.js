"use strict";

DAWCore.actions.set( "changeTempo", ( daw, bpm, bPM, sPB ) => {
	const bpmChanged = bpm !== daw.$getBPM();
	const signChanged =
			bPM !== daw.$getBeatsPerMeasure() ||
			sPB !== daw.$getStepsPerBeat();

	if ( signChanged || bpmChanged ) {
		const obj = {};
		const objPatterns = {};
		const pats = Object.entries( daw.$getPatterns() );

		if ( signChanged ) {
			obj.beatsPerMeasure = bPM;
			obj.stepsPerBeat = sPB;
			pats.forEach( ( [ id, pat ] ) => {
				if ( pat.type === "keys" || pat.type === "drums" ) {
					const duration = Math.max( 1, Math.ceil( pat.duration / bPM ) ) * bPM;

					if ( duration !== pat.duration ) {
						objPatterns[ id ] = { duration };
					}
				}
			} );
		}
		if ( bpmChanged ) {
			obj.bpm = bpm;
			pats.forEach( ( [ id, pat ] ) => {
				if ( pat.type === "buffer" && !pat.bufferBpm ) {
					const bufDur = daw.$getBuffer( pat.buffer ).duration;
					const duration = Math.ceil( bufDur * ( bpm / 60 ) );

					if ( duration !== pat.duration ) {
						objPatterns[ id ] = { duration };
					}
				}
			} );
		}
		if ( DAWCore.utils.isntEmpty( objPatterns ) ) {
			const objBlocks = {};

			obj.patterns = objPatterns;
			Object.entries( daw.$getBlocks() ).forEach( ( [ id, blc ] ) => {
				const pat = objPatterns[ blc.pattern ];

				if ( pat && !blc.durationEdited ) {
					objBlocks[ id ] = { duration: pat.duration };
				}
			} );
			DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
			if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
				const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );

				if ( dur !== daw.$getDuration() ) {
					obj.duration = dur;
				}
			}
		}
		return [
			obj,
			[ "cmp", "changeTempo", bpm, bPM, sPB ],
		];
	}
} );
