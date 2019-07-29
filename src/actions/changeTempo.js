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
			const patterns = {};
			let diff;

			obj.bpm = bpm;
			Object.entries( this.get.patterns() ).forEach( ( [ id, pat ] ) => {
				if ( pat.type === "buffer" ) {
					const buf = this.get.buffer( pat.buffer ),
						duration = Math.ceil( buf.duration * ( bpm / 60 ) );

					if ( duration !== pat.duration ) {
						patterns[ id ] = { duration };
						diff = true;
					}
				}
			} );
			if ( diff ) {
				const blocks = {};

				diff = false;
				obj.patterns = patterns;
				Object.entries( this.get.blocks() ).forEach( ( [ id, blc ] ) => {
					const pat = patterns[ blc.pattern ];

					if ( pat && !blc.durationEdited ) {
						blocks[ id ] = { duration: pat.duration };
						diff = true;
					}
				} );
				if ( diff ) {
					obj.blocks = blocks;
				}
			}
		}
		this.compositionChange( obj );
	}
};
