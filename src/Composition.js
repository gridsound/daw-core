"use strict";

DAWCore.Composition = class {
	daw = null;
	cmp = null;
	loaded = false;
	playing = false;
	saved = true;
	actionSavedOn = null;
	waSynths = new Map();
	waSched = new gswaScheduler();
	waMixer = new gswaMixer();
	waEffects = new gswaEffects( {
		getChanInput: this.waMixer.getChanInput.bind( this.waMixer ),
		getChanOutput: this.waMixer.getChanOutput.bind( this.waMixer ),
	} );
	#startedSched = new Map();
	#startedBuffers = new Map();

	constructor( daw ) {
		this.daw = daw;
		this.waSched.delayStopCallback = 4;
		this.waSched.currentTime = () => this.ctx.currentTime;
		this.waSched.ondatastart = this.#onstartBlock.bind( this );
		this.waSched.ondatastop = this.#onstopBlock.bind( this );
	}

	// un/load, change, save
	// .........................................................................
	setCtx( ctx ) {
		gswaPeriodicWaves.clearCache();
		this.ctx = ctx;
		this.waMixer.setContext( ctx ); // 1.
		this.waMixer.connect( this.daw.get.audioDestination() );
		this.waEffects.setContext( ctx );
		this.waSynths.forEach( ( syn, synId ) => {
			syn.setContext( ctx );
			syn.output.disconnect();
			syn.output.connect( this.daw.get.audioChanIn( this.cmp.synths[ synId ].dest ) );
		} );
	}
	load( cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = DAWCore.utils.jsonCopy( cmpOri );

			if ( DAWCore.Composition.format( cmp ) ) {
				this.unload();
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			const proms = [];
			const bufLoaded = {};

			this.cmp = cmp;
			this.loaded = true;
			Object.entries( cmp.buffers ).forEach( kv => {
				proms.push( this.daw.buffers.setBuffer( kv[ 1 ] )
					.then( buf => {
						if ( buf.buffer ) {
							bufLoaded[ kv[ 0 ] ] = buf;
							this.daw.callCallback( "buffersLoaded", { [ kv[ 0 ] ]: buf } );
						}
					} ) );
			} );
			this.change( cmp, {
				keys: {},
				drums: {},
				synths: {},
				blocks: {},
				slices: {},
				buffers: {},
				drumrows: {},
				channels: {},
				patterns: {},
			} );
			Promise.allSettled( proms ).then( () => {
				this.daw.buffersSlices.buffersLoaded( bufLoaded );
			} );
			this.actionSavedOn = null;
			this.saved = cmp.options.saveMode === "cloud" ||
				DAWCore.LocalStorage.has( cmp.id ) || !cmp.savedAt;
			this.daw.callCallback( "compositionSavedStatus", cmp, this.saved );
			return cmp;
		} );
	}
	unload() {
		if ( this.loaded ) {
			const d = this.waSched.data;

			this.loaded = false;
			this.waEffects.clear(); // 1.
			this.waMixer.clear();
			this.waSched.stop();
			Object.keys( d ).forEach( id => delete d[ id ] );
			this.waSynths.clear();
			this.daw.buffersSlices.clear();
			this.daw.waDrumrows.clear();
			this.saved = true;
			this.daw.callCallback( "compositionSavedStatus", this.cmp, true );
			this.cmp = null;
		}
	}
	save() {
		if ( !this.saved ) {
			this.saved = true;
			this.actionSavedOn = this.daw.history.getCurrentAction();
			this.cmp.savedAt = Math.floor( Date.now() / 1000 );
			return true;
		}
	}
	updateChanAudioData() {
		const mix = this.waMixer;
		const fn = this.daw.callCallback.bind( this.daw, "channelAnalyserFilled" );

		Object.keys( this.daw.get.channels() ).forEach( chanId => {
			mix.fillAudioData( chanId );
			fn( chanId, mix.audioDataL, mix.audioDataR );
		} );
	}

	// controls
	// .........................................................................
	getCurrentTime() {
		return this.waSched.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this.waSched.setCurrentOffsetBeat( t );
		this.daw.callCallback( "currentTime", this.getCurrentTime(), "composition" );
	}
	play() {
		if ( !this.playing ) {
			this.playing = true;
			this.#start( this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this.waSched.stop();
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
	change( obj, prevObj ) {
		const cmp = this.cmp;
		const act = this.daw.history.getCurrentAction();
		const saved = act === this.actionSavedOn && !!cmp.savedAt;

		DAWCore.utils.diffAssign( cmp, obj );
		this.waMixer.change( obj );
		this.daw.buffers.change( obj, prevObj );
		this.daw.buffersSlices.change( obj );
		this.daw.slices.change( obj );
		this.daw.waDrumrows.change( obj );
		this.daw.drums.change( obj );
		this.waEffects.change( obj );
		DAWCore.Composition.changeFns.forEach( ( fn, attr ) => {
			if ( typeof attr === "string" ) {
				if ( attr in obj ) {
					fn.call( this, obj, prevObj );
				}
			} else if ( attr.some( attr => attr in obj ) ) {
				fn.call( this, obj, prevObj );
			}
		} );
		if ( saved !== this.saved ) {
			this.saved = saved;
			this.daw.callCallback( "compositionSavedStatus", cmp, saved );
		}
		this.daw.callCallback( "compositionChanged", obj, prevObj );
		return obj;
	}

	// .........................................................................
	#setLoop( a, b ) {
		if ( Number.isFinite( a ) ) {
			this.waSched.setLoopBeat( a, b );
		} else {
			this.waSched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
		}
	}
	#start( offset ) {
		const sch = this.waSched;

		if ( this.ctx instanceof OfflineAudioContext ) {
			sch.clearLoop();
			sch.enableStreaming( false );
			sch.startBeat( 0 );
		} else {
			this.#setLoop( this.cmp.loopA, this.cmp.loopB );
			sch.enableStreaming( true );
			sch.startBeat( 0, offset );
		}
	}

	// .........................................................................
	assignPatternChange( patId, obj ) {
		this.#startedSched.forEach( ( [ patId2, sched ] ) => {
			if ( patId2 === patId ) {
				sched.change( obj );
			}
		} );
	}
	redirectPatternBuffer( patId, chanId ) {
		this.#startedBuffers.forEach( ( [ patId2, absn ] ) => {
			if ( patId2 === patId ) {
				absn.disconnect();
				absn.connect( this.daw.get.audioChanIn( chanId ) );
			}
		} );
	}

	// .........................................................................
	#onstartBlock( startedId, blcs, when, off, dur ) {
		const get = this.daw.get;
		const cmp = this.cmp;
		const blc = blcs[ 0 ][ 1 ];

		if ( cmp.tracks[ blc.track ].toggle ) {
			const patId = blc.pattern;
			const pat = cmp.patterns[ patId ];

			switch ( pat.type ) {
				case "buffer":
					this.#startBufferBlock( startedId, patId, when, off, dur, get.audioBuffer( pat.buffer ), patId, get );
					break;
				case "slices":
					this.#startBufferBlock( startedId, patId, when, off, dur, get.audioSlices( patId ), get.pattern( patId ).source, get );
					break;
				case "keys": {
					const sch = new gswaKeysScheduler();

					this.#startedSched.set( startedId, [ patId, sch ] );
					sch.scheduler.setBPM( cmp.bpm );
					sch.setContext( this.ctx );
					sch.setSynth( get.audioSynth( pat.synth ) );
					sch.change( cmp.keys[ pat.keys ] );
					sch.start( when, off, dur );
				} break;
				case "drums": {
					const sch = new gswaDrumsScheduler();

					this.#startedSched.set( startedId, [ patId, sch ] );
					sch.scheduler.setBPM( cmp.bpm );
					sch.setContext( this.ctx );
					sch.setDrumrows( this.daw.waDrumrows );
					sch.change( cmp.drums[ pat.drums ] );
					sch.start( when, off, dur );
				} break;
			}
		}
	}
	#startBufferBlock( startedId, patId, when, off, dur, buf, patSrcId, get ) {
		if ( buf ) {
			const absn = this.ctx.createBufferSource();
			const pat = get.pattern( patSrcId );
			const spd = pat.bufferBpm
				? buf.duration / ( pat.duration / get.bps() )
				: 1;

			absn.buffer = buf;
			absn.playbackRate.value = spd;
			absn.connect( get.audioChanIn( pat.dest ) );
			absn.start( when, off * spd, dur * spd );
			this.#startedBuffers.set( startedId, [ patId, absn ] );
		}
	}
	#onstopBlock( startedId ) {
		const objStarted =
				this.#startedSched.get( startedId ) ||
				this.#startedBuffers.get( startedId );

		if ( objStarted ) {
			objStarted[ 1 ].stop();
			this.#startedSched.delete( startedId );
			this.#startedBuffers.delete( startedId );
		}
	}

	// .........................................................................
	static changeFns = new Map( [
		[ "bpm", function( { bpm } ) {
			this.waSched.setBPM( bpm );
			this.waSynths.forEach( syn => syn.setBPM( bpm ) );
			this.daw.keys.setBPM( bpm );
		} ],
		[ "blocks", function( { blocks } ) {
			this.waSched.change( blocks );
		} ],
		[ [ "loopA", "loopB" ], function() {
			if ( this.daw.getFocusedObject() === this ) {
				this.waSched.setLoopBeat(
					this.cmp.loopA || 0,
					this.cmp.loopB || this.cmp.duration || this.cmp.beatsPerMeasure );
			}
		} ],
		[ "duration", function() {
			if ( this.daw.getFocusedObject() === this && this.cmp.loopA === null ) {
				this.waSched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
			}
		} ],
		[ "synths", function( { synths }, { synths: prevSynths } ) {
			Object.entries( synths ).forEach( ( [ id, synthObj ] ) => {
				if ( !synthObj ) {
					this.waSynths.get( id ).stopAllKeys();
					this.waSynths.delete( id );
				} else if ( !prevSynths[ id ] ) {
					const syn = new gswaSynth();

					syn.setContext( this.ctx );
					syn.setBPM( this.cmp.bpm );
					syn.change( synthObj );
					syn.output.connect( this.waMixer.getChanInput( synthObj.dest ) );
					this.waSynths.set( id, syn );
				} else {
					const syn = this.waSynths.get( id );

					syn.change( synthObj );
					if ( "dest" in synthObj ) {
						syn.output.disconnect();
						syn.output.connect( this.waMixer.getChanInput( synthObj.dest ) );
					}
				}
			} );
		} ],
		[ "patterns", function( { patterns } ) {
			Object.entries( patterns ).forEach( ( [ patId, patObj ] ) => {
				if ( patObj ) {
					if ( "dest" in patObj && this.cmp.patterns[ patId ].type === "buffer" ) {
						this.redirectPatternBuffer( patId, patObj.dest );
					}
					if ( patId === this.cmp.patternKeysOpened ) {
						this.daw.keys.change( patObj );
					}
				}
			} );
		} ],
		[ "keys", function( { keys, patterns } ) {
			const pats = Object.entries( this.cmp.patterns );
			const patOpened = this.cmp.patternKeysOpened;

			Object.entries( keys ).forEach( ( [ keysId, keysObj ] ) => {
				pats.some( ( [ patId, patObj ] ) => {
					if ( patObj.keys === keysId ) {
						this.assignPatternChange( patId, keysObj );
						if ( patId === patOpened ) {
							this.daw.keys.change( patterns && patterns[ patId ], keysObj );
						}
						return true;
					}
				} );
			} );
		} ],
		[ "patternKeysOpened", function( obj ) {
			this.daw.keys.openPattern( obj.patternKeysOpened );
		} ],
		[ "synthOpened", function( obj ) {
			this.daw.keys.setSynth( obj.synthOpened );
		} ],
	] );
};

/*
1. The order between the mixer and the effects is important.
*/
