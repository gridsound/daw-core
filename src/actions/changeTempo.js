"use strict";

DAWCore.actions.changeTempo = ( bpm, bPM, sPB, get ) => {
	const bpmChanged = bpm !== get.bpm(),
		signChanged =
			bPM !== get.beatsPerMeasure() ||
			sPB !== get.stepsPerBeat();

	if ( signChanged || bpmChanged ) {
		const obj = {},
			objPatterns = {},
			patts = Object.entries( get.patterns() );

		if ( signChanged ) {
			obj.beatsPerMeasure = bPM;
			obj.stepsPerBeat = sPB;
			patts.forEach( ( [ id, pat ] ) => {
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
			patts.forEach( ( [ id, pat ] ) => {
				if ( pat.type === "buffer" ) {
					const bufDur = get.buffer( pat.buffer ).duration,
						duration = Math.ceil( bufDur * ( bpm / 60 ) );

					if ( duration !== pat.duration ) {
						objPatterns[ id ] = { duration };
					}
				}
			} );
		}
		if ( DAWCore.utils.isntEmpty( objPatterns ) ) {
			const objBlocks = {};

			obj.patterns = objPatterns;
			Object.entries( get.blocks() ).forEach( ( [ id, blc ] ) => {
				const pat = objPatterns[ blc.pattern ];

				if ( pat && !blc.durationEdited ) {
					objBlocks[ id ] = { duration: pat.duration };
				}
			} );
			DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
			if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
				const dur = DAWCore.actions.common.calcNewDuration( obj, get );

				if ( dur !== get.duration() ) {
					obj.duration = dur;
				}
			}
		}
		return [
			obj,
			[ "cmp", "changeTempo", bpm, bPM, sPB ],
		];
	}
};
