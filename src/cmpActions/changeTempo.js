"use strict";

DAWCore.actions.changeTempo = function( bpm, bPM, sPB ) {
	const get = this.get,
		bpmChanged = bpm !== get.bpm(),
		timeSignChanged =
			bPM !== get.beatsPerMeasure() ||
			sPB !== get.stepsPerBeat();

	if ( timeSignChanged || bpmChanged ) {
		const obj = {};

		if ( timeSignChanged ) {
			obj.beatsPerMeasure = bPM;
			obj.stepsPerBeat = sPB;
		}
		if ( bpmChanged ) {
			const objPatterns = {};

			obj.bpm = bpm;
			Object.entries( get.patterns() ).forEach( ( [ id, pat ] ) => {
				if ( pat.type === "buffer" ) {
					const buf = get.buffer( pat.buffer ),
						duration = Math.ceil( buf.duration * ( bpm / 60 ) );

					if ( duration !== pat.duration ) {
						objPatterns[ id ] = { duration };
					}
				}
			} );
			if ( DAWCore.utils.isntEmpty( objPatterns ) ) {
				const objBlocks = {};

				obj.patterns = objPatterns;
				Object.entries( get.blocks() ).forEach( ( [ id, blc ] ) => {
					const pat = objPatterns[ blc.pattern ];

					if ( pat && !blc.durationEdited ) {
						objBlocks[ id ] = { duration: pat.duration };
					}
				} );
				if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
					const cmpDur = this.composition.getNewDuration( objPatterns );

					obj.blocks = objBlocks;
					if ( Math.abs( cmpDur - get.duration() ) > .001 ) {
						obj.duration = cmpDur;
					}
				}
			}
		}
		return [
			obj,
			[ "cmp", "changeTempo", bpm, bPM, sPB ],
		];
	}
};
