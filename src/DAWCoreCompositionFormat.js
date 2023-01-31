"use strict";

class DAWCoreCompositionFormat {
	static $out( cmp ) {
		delete cmp.options;
		if ( cmp.loopA == null || cmp.loopB == null ) {
			delete cmp.loopA;
			delete cmp.loopB;
		}
		Object.values( cmp.drumrows ).forEach( row => {
			if ( row.toggle ) { delete row.toggle; }
		} );
		Object.values( cmp.tracks ).forEach( tr => {
			if ( !tr.name ) { delete tr.name; }
			if ( tr.toggle ) { delete tr.toggle; }
		} );
		Object.values( cmp.blocks ).forEach( blc => {
			if ( !blc.offset ) { delete blc.offset; }
			if ( !blc.selected ) { delete blc.selected; }
			if ( !blc.durationEdited ) { delete blc.durationEdited; }
		} );
		Object.values( cmp.keys ).forEach( keys => {
			Object.values( keys ).forEach( key => {
				if ( !key.offset ) { delete key.offset; }
				if ( !key.selected ) { delete key.selected; }
				if ( key.prev == null ) { delete key.prev; }
				if ( key.next == null ) { delete key.next; }
			} );
		} );
		return cmp;
	}
	static $in( cmp ) {
		const blcsValues = Object.values( cmp.blocks );
		let orderDefault = 0;

		// time division
		if ( !cmp.timedivision ) {
			cmp.timedivision = cmp.beatsPerMeasure && cmp.beatsPerMeasure
				? `${ cmp.beatsPerMeasure }/${ cmp.stepsPerBeat }`
				: "4/4";
		}
		delete cmp.beatsPerMeasure;
		delete cmp.stepsPerBeat;

		// loopA/B
		// ..........................................
		if ( Number.isFinite( cmp.loopA ) && Number.isFinite( cmp.loopB ) ) {
			cmp.loopA = Math.max( 0, cmp.loopA );
			cmp.loopB = Math.max( 0, cmp.loopB );
			if ( cmp.loopA === cmp.loopB ) {
				cmp.loopA =
				cmp.loopB = null;
			}
		} else {
			cmp.loopA =
			cmp.loopB = null;
		}

		// ***Opened
		// ..........................................
		cmp.synthOpened = cmp.synthOpened ? `${ cmp.synthOpened }` : null;
		cmp.patternKeysOpened = cmp.patternKeysOpened ? `${ cmp.patternKeysOpened }` : null;
		cmp.patternDrumsOpened = cmp.patternDrumsOpened ? `${ cmp.patternDrumsOpened }` : null;
		cmp.patternBufferOpened = cmp.patternBufferOpened ? `${ cmp.patternBufferOpened }` : null;
		cmp.patternSlicesOpened = cmp.patternSlicesOpened ? `${ cmp.patternSlicesOpened }` : null;
		delete cmp.patternOpened;

		// buffers
		// ..........................................
		cmp.buffers = cmp.buffers || {};
		Object.values( cmp.buffers ).forEach( buf => {
			delete buf.MIME;
			delete buf.type;
		} );

		// slices
		// ..........................................
		cmp.slices = cmp.slices || {};

		// drumrows
		// ..........................................
		cmp.drumrows = cmp.drumrows || {};
		Object.values( cmp.drumrows ).forEach( row => {
			row.toggle = row.toggle !== false;
			row.detune = row.detune ?? 0;
		} );

		// drums
		// ..........................................
		cmp.drums = cmp.drums || {};
		Object.values( cmp.drums ).forEach( drums => {
			Object.values( drums ).forEach( drum => {
				if ( "gain" in drum ) {
					drum.pan = drum.pan ?? 0;
					drum.detune = drum.detune ?? 0;
				}
			} );
		} );

		// channels
		// ..........................................
		if ( !cmp.channels ) {
			cmp.channels = DAWCoreJSON.channels();
			Object.values( cmp.synths ).forEach( syn => syn.dest = "main" );
		}
		if ( ( !cmp.savedAt || cmp.savedAt < 1574550000 ) && cmp.channels.main.gain > .8 ) { // Sun Nov 24 2019 00:00:00 GMT+0100
			cmp.channels.main.gain = .4;
		}
		delete cmp.channels.main.order;

		// effects
		// ..........................................
		cmp.effects = cmp.effects || {};

		// patterns
		// ..........................................
		Object.values( cmp.patterns ).forEach( pat => {
			if ( !( "order" in pat ) ) {
				pat.order = orderDefault;
			}
			orderDefault = Math.max( pat.order, orderDefault ) + 1;
			switch ( pat.type ) {
				case "keys":
					pat.synth = pat.synth || "0";
					break;
				case "buffer":
					pat.bufferType = pat.bufferType || null;
					if ( pat.bufferType === "loop" ) {
						pat.bufferBpm = pat.bufferBpm || null;
					} else if ( pat.bufferType === null ) {
						switch ( cmp.buffers[ pat.buffer ].url ) {
							case "kick-00.wav":
							case "clap-00.wav":
							case "hat-00.wav":
							case "snare-00.wav":
							case "hat-open-00.wav":
								pat.bufferType = "drum";
								break;
						}
					}
					break;
			}
		} );

		// ..........................................
		Object.values( cmp.buffers ).forEach( buf => {
			switch ( buf.url ) {
				case "kick-00.wav": buf.url = "1/kick-017"; break;
				case "clap-00.wav": buf.url = "1/clap-013"; break;
				case "hat-00.wav": buf.url = "1/hat-024"; break;
				case "snare-00.wav": buf.url = "1/openhat-012"; break;
				case "hat-open-00.wav": buf.url = "1/snare-018"; break;
			}
		} );

		// synths
		// ..........................................
		if ( !cmp.synths ) {
			cmp.synths = { 0: DAWCoreJSON.synth() };
		}
		Object.values( cmp.synths ).forEach( syn => {
			delete syn.envelopes;
			syn.env = syn.env || DAWCoreJSON.env();
			syn.lfo = syn.lfo || DAWCoreJSON.lfo();
			delete syn.env.substain;
			Object.values( syn.oscillators ).forEach( osc => {
				osc.detune = Math.min( Math.max( -24, Math.round( osc.detune ) ), 24 );
				osc.detunefine = Math.min( Math.max( -1, osc.detunefine || 0 ), 1 );
				osc.unisonvoices = Math.min( Math.max( 1, Math.round( osc.unisonvoices ?? 1 ) ), 9 );
				osc.unisondetune = Math.min( Math.max( 0, osc.unisondetune ?? 0 ), 12 );
				osc.unisonblend = Math.min( Math.max( 0, osc.unisonblend ?? 0 ), 1 );
			} );
		} );

		// ..........................................
		Object.values( cmp.tracks ).reduce( ( order, tr ) => {
			tr.name = typeof tr.name === "string" ? tr.name : "";
			tr.order = typeof tr.order === "number" ? tr.order : order;
			tr.toggle = typeof tr.toggle === "boolean" ? tr.toggle : true;
			return tr.order + 1;
		}, 0 );
		blcsValues.sort( ( a, b ) => a.when - b.when );
		cmp.blocks = blcsValues.reduce( ( obj, blc, i ) => {
			blc.offset = blc.offset || 0;
			blc.selected = !!blc.selected;
			blc.durationEdited = !!blc.durationEdited;
			obj[ i ] = blc;
			return obj;
		}, {} );
		Object.values( cmp.keys ).forEach( keys => {
			Object.values( keys ).forEach( k => {
				k.pan = DAWCoreUtils.$castToNumber( k.pan, 0, -1, 1, 2 );
				k.gain = DAWCoreUtils.$castToNumber( k.gain, .8, 0, 1, 2 );
				k.lowpass = DAWCoreUtils.$castToNumber( k.lowpass, 1, 0, 1, 2 );
				k.highpass = DAWCoreUtils.$castToNumber( k.highpass, 1, 0, 1, 2 );
				k.selected = !!k.selected;
				k.gainLFOAmp = k.lfoAmp ?? k.lfoGainAmp ?? k.gainLFOAmp ?? 1;
				k.gainLFOSpeed = k.lfoSpeed ?? k.lfoGainSpeed ?? k.gainLFOSpeed ?? 1;
				if ( typeof k.prev === "number" ) { k.prev += ""; }
				if ( typeof k.next === "number" ) { k.next += ""; }
				k.prev = k.prev || null;
				k.next = k.next || null;
				delete k.attack;
				delete k.release;
				delete k.lfoAmp;
				delete k.lfoSpeed;
				delete k.lfoGainAmp;
				delete k.lfoGainSpeed;
				delete k.durationEdited;
				if ( typeof k.key === "string" ) {
					k.key = 12 * 4;
					console.warn( `DAWCoreCompositionFormat: the key ${ k.key } should be an integer` );
				}
			} );
		} );
		return cmp;
	}
}
