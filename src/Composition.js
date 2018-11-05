"use strict";

DAWCore.Composition = class {
	constructor( daw ) {
		const sch = new gswaScheduler();

		this.daw = daw;
		this.cmp = null;
		this.loaded =
		this.playing = false;
		this._saved = true;
		this._sched = sch;
		this._synths = new Map();
		this._startedSched = new Map();
		this._startedKeys = new Map();
		this._actionSavedOn = null;
		sch.currentTime = () => this.ctx.currentTime;
		sch.ondatastart = this._onstartBlock.bind( this );
		sch.ondatastop = this._onstopBlock.bind( this );
	}

	// un/load, change, save
	// ........................................................................
	setCtx( ctx ) {
		this.ctx = ctx;
		this._synths.forEach( syn => {
			syn.setContext( ctx );
			syn.connect( this.daw.get.destination() );
		} );
	}
	load( cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = DAWCore.objectDeepCopy( cmpOri );

			if ( DAWCore.Composition.format( cmp ) ) {
				this.unload();
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			this.cmp = cmp;
			this.loaded = true;
			this.change( cmp, {
				keys: {},
				synths: {},
				patterns: {},
				blocks: {},
			} );
			this._saved = DAWCore.LocalStorage.has( cmp.id ) || !cmp.savedAt;
			this._actionSavedOn = this._saved ? null : false;
			this.daw._call( "compositionSaved", cmp, this._saved );
			return cmp;
		} );
	}
	unload() {
		if ( this.loaded ) {
			const d = this._sched.data;

			this.loaded = false;
			this._sched.stop();
			Object.keys( d ).forEach( id => delete d[ id ] );
			this._synths.clear();
			this._saved = true;
			this.daw._call( "compositionSaved", this.cmp, true );
			this.cmp = null;
		}
	}
	save() {
		if ( !this._saved ) {
			this._saved = true;
			this._actionSavedOn = this.daw.history.getCurrentAction();
			this.cmp.savedAt = Math.floor( Date.now() / 1000 );
			return true;
		}
	}

	// controls
	// ........................................................................
	getSynth( id ) {
		return this._synths.get( id );
	}
	getCurrentTime() {
		return this._sched.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._sched.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "composition" );
		this.daw._clockUpdate();
	}
	play() {
		if ( !this.playing ) {
			this.playing = true;
			this._start( this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._sched.stop();
		}
	}
	stop() {
		if ( this.playing ) {
			this.pause();
			this.setCurrentTime( this.cmp.loopA || 0 );
		} else {
			this.setCurrentTime( 0 );
		}
	}

	// ........................................................................
	_setLoop( a, b ) {
		if ( !Number.isFinite( a ) ) {
			this._sched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
		} else {
			this._sched.setLoopBeat( a, b );
		}
	}
	_start( offset ) {
		const sch = this._sched;

		if ( this.ctx instanceof OfflineAudioContext ) {
			sch.clearLoop();
			sch.enableStreaming( false );
			sch.startBeat( 0 );
		} else {
			this._setLoop( this.cmp.loopA, this.cmp.loopB );
			sch.enableStreaming( true );
			sch.startBeat( 0, offset );
		}
	}

	// ........................................................................
	assignBlocksChange( data ) {
		const cmp = this.cmp;

		DAWCore.objectDeepAssign( this._sched.data, data );
		if ( cmp.loopA === false ) {
			this._sched.setLoopBeat( 0, cmp.duration || cmp.beatsPerMeasure );
		}
	}
	assignPatternChange( pat, keys ) {
		this._startedSched.forEach( sch => {
			if ( sch.pattern === pat ) {
				DAWCore.objectDeepAssign( sch.data, keys );
			}
		} );
	}

	// ........................................................................
	_onstartBlock( startedId, blcs, when, off, dur ) {
		const cmp = this.cmp,
			blc = blcs[ 0 ][ 1 ];

		if ( cmp.tracks[ blc.track ].toggle ) {
			const pat = cmp.patterns[ blc.pattern ],
				sch = new gswaScheduler();

			this._startedSched.set( startedId, sch );
			sch.pattern = pat;
			sch.currentTime = this._sched.currentTime;
			sch.ondatastart = this._onstartKey.bind( this, pat.synth );
			sch.ondatastop = this._onstopKey.bind( this, pat.synth );
			sch.setBPM( cmp.bpm );
			Object.assign( sch.data, cmp.keys[ pat.keys ] );
			if ( this.ctx instanceof OfflineAudioContext ) {
				sch.enableStreaming( false );
			}
			sch.start( when, off, dur );
		}
	}
	_onstopBlock( startedId ) {
		const sch = this._startedSched.get( startedId );

		if ( sch ) {
			sch.stop();
			this._startedSched.delete( startedId );
		}
	}
	_onstartKey( synthId, startedId, blcs, when, off, dur ) {
		this._startedKeys.set( startedId,
			this._synths.get( synthId ).startKey( blcs, when, off, dur ) );
	}
	_onstopKey( synthId, startedId ) {
		this._synths.get( synthId ).stopKey( this._startedKeys.get( startedId ) );
		this._startedKeys.delete( startedId );
	}
};
