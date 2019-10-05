"use strict";

DAWCore.prototype.changeTempo = function( bpm, beatsPerMeasure, stepsPerBeat ) {
	const bpmChanged = bpm !== this.get.bpm(),
		timeSignChanged =
			beatsPerMeasure !== this.get.beatsPerMeasure() ||
			stepsPerBeat !== this.get.stepsPerBeat();

	if ( timeSignChanged || bpmChanged ) {
		const obj = {};

		if ( timeSignChanged ) {
			obj.beatsPerMeasure = beatsPerMeasure;
			obj.stepsPerBeat = stepsPerBeat;
		}
		if ( bpmChanged ) {
			const objPatterns = {};

			obj.bpm = bpm;
			Object.entries( this.get.patterns() ).forEach( ( [ id, pat ] ) => {
				if ( pat.type === "buffer" ) {
					const buf = this.get.buffer( pat.buffer ),
						duration = Math.ceil( buf.duration * ( bpm / 60 ) );

					if ( duration !== pat.duration ) {
						objPatterns[ id ] = { duration };
					}
				}
			} );
			if ( GSData.isntEmpty( objPatterns ) ) {
				const objBlocks = {};

				obj.patterns = objPatterns;
				Object.entries( this.get.blocks() ).forEach( ( [ id, blc ] ) => {
					const pat = objPatterns[ blc.pattern ];

					if ( pat && !blc.durationEdited ) {
						objBlocks[ id ] = { duration: pat.duration };
					}
				} );
				if ( GSData.isntEmpty( objBlocks ) ) {
					const cmpDur = this.composition.getNewDuration( objPatterns );

					obj.blocks = objBlocks;
					if ( Math.abs( cmpDur - this.get.duration() ) > .001 ) {
						obj.duration = cmpDur;
					}
				}
			}
		}
		this.compositionChange( obj );
	}
};
