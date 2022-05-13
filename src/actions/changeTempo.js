"use strict";

DAWCore.actions.set( "changeTempo", ( bpm, bPM, sPB, _get, daw ) => {
	const bpmChanged = bpm !== daw.get.bpm();
	const signChanged =
			bPM !== daw.$getBeatsPerMeasure() ||
			sPB !== daw.$getStepsPerBeat();

	if ( signChanged || bpmChanged ) {
		const obj = {};
		const objPatterns = {};
		const pats = Object.entries( daw.get.patterns() );

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
					const bufDur = daw.get.buffer( pat.buffer ).duration;
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
			Object.entries( daw.get.blocks() ).forEach( ( [ id, blc ] ) => {
				const pat = objPatterns[ blc.pattern ];

				if ( pat && !blc.durationEdited ) {
					objBlocks[ id ] = { duration: pat.duration };
				}
			} );
			DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
			if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
				const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );

				if ( dur !== daw.get.duration() ) {
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
