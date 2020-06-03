"use strict";

DAWCore.Composition = class {
	constructor( daw ) {
		const sch = new gswaScheduler(),
			wamix = new gswaMixer(),
			wafxs = new gswaEffects( {
				getChanInput: wamix.getChanInput.bind( wamix ),
				getChanOutput: wamix.getChanOutput.bind( wamix ),
			} );

		this.daw = daw;
		this.cmp = null;
		this.loaded =
		this.playing = false;
		this._saved = true;
		this._sched = sch;
		this._wamixer = wamix;
		this._waeffects = wafxs;
		this._synths = new Map();
		this._startedSched = new Map();
		this._startedBuffers = new Map();
		this._actionSavedOn = null;
		sch.currentTime = () => this.ctx.currentTime;
		sch.ondatastart = this._onstartBlock.bind( this );
		sch.ondatastop = this._onstopBlock.bind( this );
	}

	// un/load, change, save
	// .........................................................................
	setCtx( ctx ) {
		gswaPeriodicWaves.clearCache();
		this.ctx = ctx;
		this._wamixer.setContext( ctx ); // 1.
		this._wamixer.connect( this.daw.get.audioDestination() );
		this._waeffects.setContext( ctx );
		this._synths.forEach( ( syn, synId ) => {
			syn.setContext( ctx );
			syn.output.disconnect();
			syn.output.connect( this.daw.get.audioChanIn( this.cmp.synths[ synId ].dest ) );
		} );
	}
	load( cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = GSUtils.jsonCopy( cmpOri );

			if ( DAWCore.Composition.format( cmp ) ) {
				this.unload();
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			this.cmp = cmp;
			this.loaded = true;
			Object.entries( cmp.buffers ).forEach( kv => {
				this.daw.buffers.setBuffer( kv[ 1 ] )
					.then( buf => {
						if ( buf.buffer ) {
							this.daw._call( "buffersLoaded", { [ kv[ 0 ] ]: buf } );
						}
					} );
			} );
			this.change( cmp, {
				keys: {},
				drums: {},
				synths: {},
				blocks: {},
				buffers: {},
				drumrows: {},
				channels: {},
				patterns: {},
			} );
			this._actionSavedOn = null;
			this._saved = cmp.options.saveMode === "cloud" ||
				DAWCore.LocalStorage.has( cmp.id ) || !cmp.savedAt;
			this.daw._call( "compositionSavedStatus", cmp, this._saved );
			return cmp;
		} );
	}
	unload() {
		if ( this.loaded ) {
			const d = this._sched.data;

			this.loaded = false;
			this._waeffects.clear(); // 1.
			this._wamixer.clear();
			this._sched.stop();
			Object.keys( d ).forEach( id => delete d[ id ] );
			this._synths.clear();
			this.daw._wadrumrows.clear();
			this._saved = true;
			this.daw._call( "compositionSavedStatus", this.cmp, true );
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
	updateChanAudioData() {
		const mix = this._wamixer,
			fn = this.daw._call.bind( this.daw, "channelAnalyserFilled" );

		Object.keys( this.daw.get.channels() ).forEach( chanId => {
			mix.fillAudioData( chanId );
			fn( chanId, mix.audioDataL, mix.audioDataR );
		} );
	}

	// controls
	// .........................................................................
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

	// .........................................................................
	_setLoop( a, b ) {
		if ( Number.isFinite( a ) ) {
			this._sched.setLoopBeat( a, b );
		} else {
			this._sched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
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

	// .........................................................................
	assignPatternChange( patId, obj ) {
		this._startedSched.forEach( ( [ patId2, sched ] ) => {
			if ( patId2 === patId ) {
				sched.change( obj );
			}
		} );
	}
	redirectPatternBuffer( patId, chanId ) {
		this._startedBuffers.forEach( ( [ patId2, absn ] ) => {
			if ( patId2 === patId ) {
				absn.disconnect();
				absn.connect( this.daw.get.audioChanIn( chanId ) );
			}
		} );
	}

	// .........................................................................
	_onstartBlock( startedId, blcs, when, off, dur ) {
		const cmp = this.cmp,
			blc = blcs[ 0 ][ 1 ];

		if ( cmp.tracks[ blc.track ].toggle ) {
			const patId = blc.pattern,
				pat = cmp.patterns[ patId ];

			switch ( pat.type ) {
				case "buffer": {
					const buf = this.daw.get.audioBuffer( pat.buffer );

					if ( buf ) {
						const absn = this.ctx.createBufferSource();

						absn.buffer = buf;
						absn.connect( this.daw.get.audioChanIn( pat.dest ) );
						absn.start( when, off, dur );
						this._startedBuffers.set( startedId, [ patId, absn ] );
					}
				} break;
				case "keys": {
					const waKeys = new gswaKeysScheduler( this.ctx );

					this._startedSched.set( startedId, [ patId, waKeys ] );
					waKeys.scheduler.setBPM( cmp.bpm );
					waKeys.setSynth( this.daw.get.audioSynth( pat.synth ) );
					waKeys.change( cmp.keys[ pat.keys ] );
					waKeys.start( when, off, dur );
				} break;
				case "drums": {
					const waDrums = new gswaDrumsScheduler( this.ctx );

					this._startedSched.set( startedId, [ patId, waDrums ] );
					waDrums.scheduler.setBPM( cmp.bpm );
					waDrums.setDrumrows( this.daw._wadrumrows );
					waDrums.change( cmp.drums[ pat.drums ] );
					waDrums.start( when, off, dur );
				} break;
			}
		}
	}
	_onstopBlock( startedId ) {
		const objStarted =
				this._startedSched.get( startedId ) ||
				this._startedBuffers.get( startedId );

		if ( objStarted ) {
			objStarted[ 1 ].stop();
			this._startedSched.delete( startedId );
			this._startedBuffers.delete( startedId );
		}
	}
};

/*
1. The order between the mixer and the effects is important.
*/
