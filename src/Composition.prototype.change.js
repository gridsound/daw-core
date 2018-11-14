"use strict";

DAWCore.Composition.prototype.change = function( obj, prevObj ) {
	const act = this.daw.history.getCurrentAction(),
		saved = act === this._actionSavedOn;

	DAWCore.objectDeepAssign( this.cmp, obj );
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
		this.daw._call( "compositionSaved", this.cmp, saved );
	}
	this.daw._call( "compositionChanged", obj, prevObj );
	return obj;
};

DAWCore.Composition.prototype.change.fn = new Map( [
	[ "bpm", function( { bpm } ) {
		this._sched.setBPM( bpm );
		this._synths.forEach( syn => syn.setBPM( bpm ) );
		this.daw.pianoroll.setBPM( bpm );
	} ],
	[ [ "loopA", "loopB" ], function() {
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
				syn.connect( this.daw.get.destination() );
				DAWCore.objectDeepAssign( syn.data, synthObj );
				this._synths.set( id, syn );
			} else {
				DAWCore.objectDeepAssign( this._synths.get( id ).data, synthObj );
			}
		} );
	} ],
	[ "keys", function( { keys, patterns } ) {
		const pats = Object.entries( this.cmp.patterns ),
			patOpened = this.cmp.patternOpened;

		Object.entries( keys ).forEach( ( [ keysId, keysObj ] ) => {
			pats.some( ( [ patId, patObj ] ) => {
				if ( patObj.keys === keysId ) {
					this.assignPatternChange( patObj, keysObj );
					if ( patId === patOpened ) {
						this.daw.pianoroll.change( patterns && patterns[ patId ], keysObj );
					}
					return true;
				}
			} );
		} );
	} ],
	[ "patternOpened", function( obj ) {
		this.daw.pianoroll.openPattern( obj.patternOpened );
	} ],
	[ "synthOpened", function( obj ) {
		this.daw.pianoroll.setSynth( obj.synthOpened );
	} ],
] );
