"use strict";

DAWCore.Composition.prototype.change = function( obj, prevObj ) {
	const cmp = this.cmp,
		act = this.daw.history.getCurrentAction(),
		saved = act === this._actionSavedOn && !!cmp.savedAt;

	GSData.deepAssign( cmp, obj );
	this.change.fn.forEach( ( fn, attr ) => {
		if ( typeof attr === "string" ) {
			if ( attr in obj ) {
				fn.call( this, obj, prevObj );
			}
		} else if ( attr.some( attr => attr in obj ) ) {
			fn.call( this, obj, prevObj );
		}
	} );

	if ( saved !== this._saved ) {
		this._saved = saved;
		this.daw._call( "compositionSavedStatus", cmp, saved );
	}
	this.daw._call( "compositionChanged", obj, prevObj );
	return obj;
};

DAWCore.Composition.prototype.change.fn = new Map( [
	[ "bpm", function( { bpm } ) {
		this._sched.setBPM( bpm );
		this._synths.forEach( syn => syn.setBPM( bpm ) );
		this._waeffects.setBPM( bpm );
		this.daw.pianoroll.setBPM( bpm );
	} ],
	[ "channels", function( { channels } ) {
		this._wamixer.change( channels );
	} ],
	[ "effects", function( { effects } ) {
		this._waeffects.change( effects );
	} ],
	[ [ "duration", "loopA", "loopB" ], function() {
		if ( this.daw.compositionFocused ) {
			const get = this.daw.get;

			this._sched.setLoopBeat(
				get.loopA() || 0,
				get.loopB() || get.duration() || get.beatsPerMeasure() );
		}
	} ],
	[ "blocks", function( { blocks } ) {
		this.assignBlocksChange( blocks );
	} ],
	[ "synths", function( { synths }, { synths: prevSynths } ) {
		Object.entries( synths ).forEach( ( [ id, synthObj ] ) => {
			if ( !synthObj ) {
				this._synths.get( id ).stopAllKeys();
				this._synths.delete( id );
			} else if ( !prevSynths[ id ] ) {
				const syn = new gswaSynth();

				syn.setContext( this.daw.get.ctx() );
				syn.setBPM( this.daw.get.bpm() );
				syn.connect( this._wamixer.getChanInput( synthObj.dest ) );
				GSData.deepAssign( syn.data.oscillators, synthObj.oscillators );
				this._synths.set( id, syn );
			} else {
				const syn = this._synths.get( id );

				if ( "oscillators" in synthObj ) {
					GSData.deepAssign( syn.data.oscillators, synthObj.oscillators );
				}
				if ( "dest" in synthObj ) {
					syn.disconnect();
					syn.connect( this._wamixer.getChanInput( synthObj.dest ) );
				}
			}
		} );
	} ],
	[ "patterns", function( { patterns } ) {
		Object.entries( patterns ).forEach( ( [ patId, patObj ] ) => {
			if ( patObj && "dest" in patObj && this.cmp.patterns[ patId ].type === "buffer" ) {
				this.redirectPatternBuffer( patId, patObj.dest );
			}
		} );
	} ],
	[ "keys", function( { keys, patterns } ) {
		const pats = Object.entries( this.cmp.patterns ),
			patOpened = this.cmp.patternKeysOpened;

		Object.entries( keys ).forEach( ( [ keysId, keysObj ] ) => {
			pats.some( ( [ patId, patObj ] ) => {
				if ( patObj.keys === keysId ) {
					this.assignPatternKeysChange( patId, keysObj );
					if ( patId === patOpened ) {
						this.daw.pianoroll.change( patterns && patterns[ patId ], keysObj );
					}
					return true;
				}
			} );
		} );
	} ],
	[ "patternKeysOpened", function( obj ) {
		this.daw.pianoroll.openPattern( obj.patternKeysOpened );
	} ],
	[ "synthOpened", function( obj ) {
		this.daw.pianoroll.setSynth( obj.synthOpened );
	} ],
] );
