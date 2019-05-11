"use strict";

DAWCore.prototype.changePatternKeys = function( patId, keysObj ) {
	const pat = this.get.pattern( patId );

	if ( !pat ) {
		this._error( "changePatternKeys", "pattern", patId );
	} else {
		const keys = this.get.keys( pat.keys ),
			dur = this._changePatternKeysCalcDuration( pat, keys, keysObj ),
			obj = this._changePatternKeys( patId, keysObj, pat, dur );

		this.compositionChange( obj );
	}
};

DAWCore.prototype._changePatternKeysCalcDuration = function( pat, keys, keysObj ) {
	const bPM = this.get.beatsPerMeasure(),
		dur = Object.entries( keys ).reduce( ( dur, [ keyId, key ] ) => {
			if ( keyId in keysObj ) {
				const keyObj = keysObj[ keyId ];

				if ( keyObj ) {
					const w = "when" in keyObj ? keyObj.when : key.when,
						d = "duration" in keyObj ? keyObj.duration : key.duration;

					return Math.max( dur, w + d );
				}
			} else {
				return Math.max( dur, key.when + key.duration );
			}
			return dur;
		}, 0 ),
		dur2 = Object.entries( keysObj ).reduce( ( dur, [ keyId, key ] ) => {
			return keyId in keys
				? dur
				: Math.max( dur, key.when + key.duration );
		}, dur );

	return Math.max( 1, Math.ceil( dur2 / bPM ) ) * bPM;
};

DAWCore.prototype._changePatternKeys = function( patId, keysObj, pat, duration ) {
	const bPM = this.get.beatsPerMeasure(),
		obj = { keys: { [ pat.keys ]: keysObj } };

	if ( duration !== pat.duration ) {
		const objBlocks = {},
			cmpRealDur = Object.entries( this.get.blocks() )
				.reduce( ( dur, [ id, blc ] ) => {
					if ( blc.pattern !== patId ) {
						return Math.max( dur, blc.when + blc.duration );
					} else if ( !blc.durationEdited ) {
						objBlocks[ id ] = { duration };
						return Math.max( dur, blc.when + duration );
					}
					return dur;
				}, 0 ),
			cmpDur = Math.ceil( cmpRealDur / bPM ) * bPM;

		obj.patterns = { [ patId ]: { duration } };
		if ( !DAWCore.objectIsEmpty( objBlocks ) ) {
			obj.blocks = objBlocks;
		}
		if ( Math.abs( cmpDur - this.get.duration() ) > .001 ) {
			obj.duration = cmpDur;
		}
	}
	return obj;
};
