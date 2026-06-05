import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// ── Equipos ──────────────────────────────────────────────────
const GROUPS = [
  {name:'A',teams:[{f:'AR',n:'Argentina'},{f:'EC',n:'Ecuador'},{f:'CL',n:'Chile'},{f:'CA',n:'Canada'}]},
  {name:'B',teams:[{f:'FR',n:'Francia'},{f:'UY',n:'Uruguay'},{f:'TZ',n:'Tanzania'},{f:'US',n:'EE.UU.'}]},
  {name:'C',teams:[{f:'BR',n:'Brasil'},{f:'SE',n:'Suecia'},{f:'CM',n:'Camerun'},{f:'MX',n:'Mexico'}]},
  {name:'D',teams:[{f:'GB',n:'Inglaterra'},{f:'AU',n:'Australia'},{f:'BE',n:'Belgica'},{f:'JP',n:'Japon'}]},
  {name:'E',teams:[{f:'DE',n:'Alemania'},{f:'CO',n:'Colombia'},{f:'KR',n:'Corea del Sur'},{f:'ES',n:'Espana'}]},
  {name:'F',teams:[{f:'PT',n:'Portugal'},{f:'MA',n:'Marruecos'},{f:'CR',n:'Costa Rica'},{f:'PE',n:'Peru'}]},
  {name:'G',teams:[{f:'NL',n:'Paises Bajos'},{f:'CI',n:'Costa de Marfil'},{f:'SN',n:'Senegal'},{f:'VE',n:'Venezuela'}]},
  {name:'H',teams:[{f:'PL',n:'Polonia'},{f:'SA',n:'Arabia Saudita'},{f:'RS',n:'Serbia'},{f:'CH',n:'Suiza'}]},
  {name:'I',teams:[{f:'PY',n:'Paraguay'},{f:'AT',n:'Austria'},{f:'ZA',n:'Sudafrica'},{f:'NZ',n:'Nueva Zelanda'}]},
  {name:'J',teams:[{f:'TR',n:'Turquia'},{f:'UA',n:'Ucrania'},{f:'GH',n:'Ghana'},{f:'QA',n:'Qatar'}]},
  {name:'K',teams:[{f:'IR',n:'Iran'},{f:'SK',n:'Eslovaquia'},{f:'KE',n:'Kenia'},{f:'GR',n:'Grecia'}]},
  {name:'L',teams:[{f:'HR',n:'Croacia'},{f:'BY',n:'Bielorrusia'},{f:'PA',n:'Panama'},{f:'EG',n:'Egipto'}]},
]

// Partidos de grupos con fecha/hora real (UTC-3 Argentina)
// Cada partido: id, grupo, local, visitante, fecha
const GROUP_MATCHES = [
  // Grupo A
  {id:'gA1',g:'A',a:0,b:1,date:new Date('2026-06-11T16:00:00-03:00')},
  {id:'gA2',g:'A',a:2,b:3,date:new Date('2026-06-11T19:00:00-03:00')},
  {id:'gA3',g:'A',a:0,b:2,date:new Date('2026-06-15T16:00:00-03:00')},
  {id:'gA4',g:'A',a:1,b:3,date:new Date('2026-06-15T19:00:00-03:00')},
  {id:'gA5',g:'A',a:0,b:3,date:new Date('2026-06-19T19:00:00-03:00')},
  {id:'gA6',g:'A',a:1,b:2,date:new Date('2026-06-19T19:00:00-03:00')},
  // Grupo B
  {id:'gB1',g:'B',a:0,b:1,date:new Date('2026-06-12T13:00:00-03:00')},
  {id:'gB2',g:'B',a:2,b:3,date:new Date('2026-06-12T16:00:00-03:00')},
  {id:'gB3',g:'B',a:0,b:2,date:new Date('2026-06-16T13:00:00-03:00')},
  {id:'gB4',g:'B',a:1,b:3,date:new Date('2026-06-16T16:00:00-03:00')},
  {id:'gB5',g:'B',a:0,b:3,date:new Date('2026-06-20T19:00:00-03:00')},
  {id:'gB6',g:'B',a:1,b:2,date:new Date('2026-06-20T19:00:00-03:00')},
  // Grupo C
  {id:'gC1',g:'C',a:0,b:1,date:new Date('2026-06-12T19:00:00-03:00')},
  {id:'gC2',g:'C',a:2,b:3,date:new Date('2026-06-13T13:00:00-03:00')},
  {id:'gC3',g:'C',a:0,b:2,date:new Date('2026-06-17T13:00:00-03:00')},
  {id:'gC4',g:'C',a:1,b:3,date:new Date('2026-06-17T16:00:00-03:00')},
  {id:'gC5',g:'C',a:0,b:3,date:new Date('2026-06-21T19:00:00-03:00')},
  {id:'gC6',g:'C',a:1,b:2,date:new Date('2026-06-21T19:00:00-03:00')},
  // Grupos D-L simplificados con fechas aproximadas
  {id:'gD1',g:'D',a:0,b:1,date:new Date('2026-06-13T16:00:00-03:00')},
  {id:'gD2',g:'D',a:2,b:3,date:new Date('2026-06-13T19:00:00-03:00')},
  {id:'gD3',g:'D',a:0,b:2,date:new Date('2026-06-17T19:00:00-03:00')},
  {id:'gD4',g:'D',a:1,b:3,date:new Date('2026-06-18T13:00:00-03:00')},
  {id:'gD5',g:'D',a:0,b:3,date:new Date('2026-06-22T19:00:00-03:00')},
  {id:'gD6',g:'D',a:1,b:2,date:new Date('2026-06-22T19:00:00-03:00')},
  {id:'gE1',g:'E',a:0,b:1,date:new Date('2026-06-14T13:00:00-03:00')},
  {id:'gE2',g:'E',a:2,b:3,date:new Date('2026-06-14T16:00:00-03:00')},
  {id:'gE3',g:'E',a:0,b:2,date:new Date('2026-06-18T16:00:00-03:00')},
  {id:'gE4',g:'E',a:1,b:3,date:new Date('2026-06-18T19:00:00-03:00')},
  {id:'gE5',g:'E',a:0,b:3,date:new Date('2026-06-23T19:00:00-03:00')},
  {id:'gE6',g:'E',a:1,b:2,date:new Date('2026-06-23T19:00:00-03:00')},
  {id:'gF1',g:'F',a:0,b:1,date:new Date('2026-06-14T19:00:00-03:00')},
  {id:'gF2',g:'F',a:2,b:3,date:new Date('2026-06-15T13:00:00-03:00')},
  {id:'gF3',g:'F',a:0,b:2,date:new Date('2026-06-19T13:00:00-03:00')},
  {id:'gF4',g:'F',a:1,b:3,date:new Date('2026-06-19T16:00:00-03:00')},
  {id:'gF5',g:'F',a:0,b:3,date:new Date('2026-06-24T19:00:00-03:00')},
  {id:'gF6',g:'F',a:1,b:2,date:new Date('2026-06-24T19:00:00-03:00')},
  {id:'gG1',g:'G',a:0,b:1,date:new Date('2026-06-20T13:00:00-03:00')},
  {id:'gG2',g:'G',a:2,b:3,date:new Date('2026-06-20T16:00:00-03:00')},
  {id:'gG3',g:'G',a:0,b:2,date:new Date('2026-06-24T13:00:00-03:00')},
  {id:'gG4',g:'G',a:1,b:3,date:new Date('2026-06-24T16:00:00-03:00')},
  {id:'gG5',g:'G',a:0,b:3,date:new Date('2026-06-28T19:00:00-03:00')},
  {id:'gG6',g:'G',a:1,b:2,date:new Date('2026-06-28T19:00:00-03:00')},
  {id:'gH1',g:'H',a:0,b:1,date:new Date('2026-06-21T13:00:00-03:00')},
  {id:'gH2',g:'H',a:2,b:3,date:new Date('2026-06-21T16:00:00-03:00')},
  {id:'gH3',g:'H',a:0,b:2,date:new Date('2026-06-25T13:00:00-03:00')},
  {id:'gH4',g:'H',a:1,b:3,date:new Date('2026-06-25T16:00:00-03:00')},
  {id:'gH5',g:'H',a:0,b:3,date:new Date('2026-06-29T19:00:00-03:00')},
  {id:'gH6',g:'H',a:1,b:2,date:new Date('2026-06-29T19:00:00-03:00')},
  {id:'gI1',g:'I',a:0,b:1,date:new Date('2026-06-22T13:00:00-03:00')},
  {id:'gI2',g:'I',a:2,b:3,date:new Date('2026-06-22T16:00:00-03:00')},
  {id:'gI3',g:'I',a:0,b:2,date:new Date('2026-06-26T13:00:00-03:00')},
  {id:'gI4',g:'I',a:1,b:3,date:new Date('2026-06-26T16:00:00-03:00')},
  {id:'gI5',g:'I',a:0,b:3,date:new Date('2026-06-30T19:00:00-03:00')},
  {id:'gI6',g:'I',a:1,b:2,date:new Date('2026-06-30T19:00:00-03:00')},
  {id:'gJ1',g:'J',a:0,b:1,date:new Date('2026-06-23T13:00:00-03:00')},
  {id:'gJ2',g:'J',a:2,b:3,date:new Date('2026-06-23T16:00:00-03:00')},
  {id:'gJ3',g:'J',a:0,b:2,date:new Date('2026-06-27T13:00:00-03:00')},
  {id:'gJ4',g:'J',a:1,b:3,date:new Date('2026-06-27T16:00:00-03:00')},
  {id:'gJ5',g:'J',a:0,b:3,date:new Date('2026-07-01T19:00:00-03:00')},
  {id:'gJ6',g:'J',a:1,b:2,date:new Date('2026-07-01T19:00:00-03:00')},
  {id:'gK1',g:'K',a:0,b:1,date:new Date('2026-06-25T19:00:00-03:00')},
  {id:'gK2',g:'K',a:2,b:3,date:new Date('2026-06-26T19:00:00-03:00')},
  {id:'gK3',g:'K',a:0,b:2,date:new Date('2026-06-29T13:00:00-03:00')},
  {id:'gK4',g:'K',a:1,b:3,date:new Date('2026-06-29T16:00:00-03:00')},
  {id:'gK5',g:'K',a:0,b:3,date:new Date('2026-07-02T19:00:00-03:00')},
  {id:'gK6',g:'K',a:1,b:2,date:new Date('2026-07-02T19:00:00-03:00')},
  {id:'gL1',g:'L',a:0,b:1,date:new Date('2026-06-27T19:00:00-03:00')},
  {id:'gL2',g:'L',a:2,b:3,date:new Date('2026-06-28T13:00:00-03:00')},
  {id:'gL3',g:'L',a:0,b:2,date:new Date('2026-07-01T13:00:00-03:00')},
  {id:'gL4',g:'L',a:1,b:3,date:new Date('2026-07-01T16:00:00-03:00')},
  {id:'gL5',g:'L',a:0,b:3,date:new Date('2026-07-03T19:00:00-03:00')},
  {id:'gL6',g:'L',a:1,b:2,date:new Date('2026-07-03T19:00:00-03:00')},
]

const KNOCKOUT_DATES = {
  r32: new Date('2026-07-05T16:00:00-03:00'),
  r16: new Date('2026-07-09T16:00:00-03:00'),
  qf:  new Date('2026-07-12T16:00:00-03:00'),
  sf:  new Date('2026-07-15T16:00:00-03:00'),
  final: new Date('2026-07-19T16:00:00-03:00'),
}

const LOCK_MINS = 20

function isMatchLocked(date) {
  return new Date() > new Date(date.getTime() - LOCK_MINS * 60000)
}

function isRoundLocked(round) {
  return new Date() > new Date(KNOCKOUT_DATES[round].getTime() - LOCK_MINS * 60000)
}

function timeLeftStr(date) {
  const diff = new Date(date.getTime() - LOCK_MINS * 60000) - new Date()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (d > 0) return d + 'd ' + h + 'h'
  if (h > 0) return h + 'h ' + m + 'm'
  return m + ' min'
}

function flag(code) {
  return 'https://flagcdn.com/24x18/' + code.toLowerCase() + '.png'
}

function emptyProde() {
  return { groups: {}, scores: {}, r32: {}, r16: {}, qf: {}, sf: {}, third: {}, final: {} }
}

// Puntos: 1 por ganador correcto, 2 por marcador exacto
// Penales = empate en marcador normal
function calcMatchPoints(pred, real) {
  if (!pred || !real) return 0
  var pa = parseInt(pred.a), pb = parseInt(pred.b)
  var ra = parseInt(real.a), rb = parseInt(real.b)
  if (isNaN(pa) || isNaN(pb) || isNaN(ra) || isNaN(rb)) return 0
  // resultado exacto
  if (pa === ra && pb === rb) return 2
  // ganador correcto
  var predWin = pa > pb ? 'a' : pa < pb ? 'b' : 'e'
  var realWin = ra > rb ? 'a' : ra < rb ? 'b' : 'e'
  if (predWin === realWin) return 1
  return 0
}

function calcScore(prode, results) {
  if (!prode) return 0
  var pts = 0
  results = results || {}
  // group matches
  GROUP_MATCHES.forEach(function(m) {
    var pred = prode.scores && prode.scores[m.id]
    var real = results[m.id]
    pts += calcMatchPoints(pred, real)
  })
  // knockouts: 1 pt ganador, 2 pt exacto, multiplicado por ronda
  var rounds = ['r32','r16','qf','sf','final']
  var mult = {r32:1, r16:2, qf:3, sf:4, final:5}
  rounds.forEach(function(r) {
    var rData = prode[r] || {}
    Object.keys(rData).forEach(function(matchId) {
      var pred = rData[matchId]
      var real = results[matchId]
      if (pred && real && pred.n === real.n) pts += mult[r]
    })
  })
  return pts
}

function calcStats(prode, results) {
  var gf = 0, ga = 0
  results = results || {}
  GROUP_MATCHES.forEach(function(m) {
    var pred = prode.scores && prode.scores[m.id]
    if (pred) {
      var pa = parseInt(pred.a) || 0
      var pb = parseInt(pred.b) || 0
      gf += pa + pb
    }
    var real = results[m.id]
    if (real) {
      var ra = parseInt(real.a) || 0
      var rb = parseInt(real.b) || 0
      ga += ra + rb
    }
  })
  return { gf: gf, ga: ga, diff: gf - ga }
}

var ADMIN = 'Tomy'
var C = { red:'#C0392B', blue:'#1565C0', gold:'#F9A825', green:'#27ae60', border:'#e0e0e0', gray:'#888' }

function sBtn(col, extra) {
  return Object.assign({ background:col||C.blue, color:'#fff', border:'none', borderRadius:'10px', padding:'10px 16px', cursor:'pointer', fontSize:'14px', fontWeight:500, width:'100%', marginTop:'8px' }, extra||{})
}
function sSmallBtn(col) {
  return { background:col||C.blue, color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12 }
}
var sHeader = { background:'linear-gradient(135deg,#C0392B 0%,#1565C0 60%,#F9A825 100%)', padding:'16px', textAlign:'center', borderRadius:'14px', marginBottom:'8px', color:'#fff' }
var sCard = { background:'#fff', border:'1px solid '+C.border, borderRadius:'10px', overflow:'hidden', marginBottom:'8px' }
var sInput = { width:'100%', padding:'10px 12px', fontSize:'16px', border:'2px solid '+C.blue, borderRadius:'10px', outline:'none', fontFamily:'inherit' }
var sLock = { display:'inline-block', background:'#ffecb3', color:'#7b5800', borderRadius:'20px', padding:'2px 8px', fontSize:'11px' }
function sTab(a) { return { flex:1, padding:'8px 2px', border:'none', borderRadius:'8px 8px 0 0', cursor:'pointer', fontSize:'11px', fontWeight:500, background:a?C.blue:'#eee', color:a?'#fff':'#555' } }
function sTeamRow(sel) {
  return { display:'flex', alignItems:'center', gap:'6px', padding:'6px 8px', cursor:'pointer', fontSize:'12px', borderBottom:'1px solid '+C.border, background:sel===1?'#fff8e1':sel===2?'#e8f5e9':'#fff', borderLeft:sel===1?'3px solid '+C.gold:sel===2?'3px solid '+C.green:'3px solid transparent' }
}
function sMatchTeam(w) {
  return { display:'flex', alignItems:'center', gap:'8px', padding:'7px 10px', cursor:'pointer', fontSize:'13px', borderBottom:'1px solid '+C.border, background:w?'#e3f0fb':'#fff', borderLeft:w?'4px solid '+C.blue:'4px solid transparent', fontWeight:w?600:400 }
}

// ── Supabase ──────────────────────────────────────────────────
async function dbGetAll() {
  var res = await supabase.from('prodes').select('*').order('updated_at',{ascending:false})
  if (res.error) { console.error(res.error); return [] }
  return res.data
}
async function dbUpsert(name, prode) {
  var res = await supabase.from('prodes').upsert({player_name:name,prode:prode,updated_at:new Date().toISOString()},{onConflict:'player_name'})
  if (res.error) console.error(res.error)
}
async function dbGetOne(name) {
  var res = await supabase.from('prodes').select('*').eq('player_name',name).single()
  if (res.error) return null
  return res.data
}
async function dbGetResults() {
  var res = await supabase.from('results').select('*').eq('id','main').single()
  if (res.error) return {}
  return res.data ? res.data.data : {}
}
async function dbSaveResults(data) {
  var res = await supabase.from('results').upsert({id:'main',data:data,updated_at:new Date().toISOString()},{onConflict:'id'})
  if (res.error) console.error(res.error)
}

const FDORG_KEY = 'acdf3492441b4b24bad344dd71f2eaa3'
const WC2026_ID = 2000

async function fetchLiveMatches() {
  try {
    var res = await fetch('https://api.football-data.org/v4/competitions/'+WC2026_ID+'/matches', {
      headers: { 'X-Auth-Token': FDORG_KEY }
    })
    if (!res.ok) return null
    var json = await res.json()
    return json.matches || null
  } catch(e) { return null }
}

async function fetchLiveResults() {
  try {
    var res = await fetch('https://api.football-data.org/v4/competitions/'+WC2026_ID+'/matches?status=FINISHED', {
      headers: { 'X-Auth-Token': FDORG_KEY }
    })
    if (!res.ok) return null
    var json = await res.json()
    var results = {}
    if (!json.matches) return null
    json.matches.forEach(function(m) {
      // Buscar partido correspondiente por equipos
      var homeName = m.homeTeam.name
      var awayName = m.awayTeam.name
      var ha = m.score.fullTime.home
      var hb = m.score.fullTime.away
      if (ha === null || hb === null) return
      // Buscar en GROUP_MATCHES por nombre de equipo
      GROUP_MATCHES.forEach(function(gm) {
        var g = GROUPS.find(function(x){return x.name===gm.g})
        if (!g) return
        var ta = g.teams[gm.a], tb = g.teams[gm.b]
        if (
          (homeName.toLowerCase().includes(ta.n.toLowerCase()) || ta.n.toLowerCase().includes(homeName.toLowerCase().split(' ')[0])) &&
          (awayName.toLowerCase().includes(tb.n.toLowerCase()) || tb.n.toLowerCase().includes(awayName.toLowerCase().split(' ')[0]))
        ) {
          results[gm.id] = {a: String(ha), b: String(hb)}
        }
      })
      // Knockouts por stage
      var stage = m.stage
      var roundMap = {LAST_32:'r32', ROUND_OF_16:'r16', QUARTER_FINALS:'qf', SEMI_FINALS:'sf', FINAL:'final'}
      var round = roundMap[stage]
      if (round) {
        // guardar por id de partido de la API
        results['api_'+m.id] = {a: String(ha), b: String(hb), home: homeName, away: awayName, round: round}
      }
    })
    return results
  } catch(e) {
    console.error('API error:', e)
    return null
  }
}

var R32_PAIRS = [
  [{g:'A',p:1},{g:'B',p:2}],[{g:'C',p:1},{g:'D',p:2}],
  [{g:'E',p:1},{g:'F',p:2}],[{g:'G',p:1},{g:'H',p:2}],
  [{g:'I',p:1},{g:'J',p:2}],[{g:'K',p:1},{g:'L',p:2}],
  [{g:'B',p:1},{g:'A',p:2}],[{g:'D',p:1},{g:'C',p:2}],
  [{g:'F',p:1},{g:'E',p:2}],[{g:'H',p:1},{g:'G',p:2}],
  [{g:'J',p:1},{g:'I',p:2}],[{g:'L',p:1},{g:'K',p:2}],
  [null,null],[null,null],[null,null],[null,null],
]
var ROUND_COUNTS = {r32:16,r16:8,qf:4,sf:2}
var ROUND_LABELS = {r32:'Partido',r16:'Octavo',qf:'Cuarto',sf:'Semifinal'}

function getGroupQualified(prode, gName, pos) {
  var g = GROUPS.find(function(x){return x.name===gName})
  if (!g) return null
  var idx = g.teams.findIndex(function(_,i){return prode.groups[gName+'_'+i]===pos})
  return idx<0?null:g.teams[idx]
}
function getMatchTeams(prode, round, idx) {
  if (round==='r32') {
    var pair=R32_PAIRS[idx]
    if(!pair[0])return[null,null]
    return[getGroupQualified(prode,pair[0].g,pair[0].p),getGroupQualified(prode,pair[1].g,pair[1].p)]
  }
  if(round==='r16')return[prode.r32['r32_'+(idx*2)]||null,prode.r32['r32_'+(idx*2+1)]||null]
  if(round==='qf')return[prode.r16['r16_'+(idx*2)]||null,prode.r16['r16_'+(idx*2+1)]||null]
  if(round==='sf')return[prode.qf['qf_'+(idx*2)]||null,prode.qf['qf_'+(idx*2+1)]||null]
  return[null,null]
}

// ══════════════════════════════════════════════════════════════
export default function App() {
  var [screen, setScreen] = useState('home')
  var [currentPlayer, setPlayer] = useState(null)
  var [prode, setProdeState] = useState(emptyProde())
  var [nameInput, setNameInput] = useState('')
  var [passInput, setPassInput] = useState('')
  var [players, setPlayers] = useState([])
  var [results, setResults] = useState({})
  var [loading, setLoading] = useState(false)
  var [saving, setSaving] = useState(false)
  var [activeTab, setActiveTab] = useState('groups')
  var [error, setError] = useState('')

  useEffect(function(){
    fetchAll()
    // Actualizar resultados en vivo cada 5 minutos
    var interval = setInterval(function(){
      syncLiveResults()
    }, 5 * 60 * 1000)
    return function(){ clearInterval(interval) }
  },[])

  async function syncLiveResults() {
    var liveResults = await fetchLiveResults()
    if (liveResults && Object.keys(liveResults).length > 0) {
      var current = await dbGetResults()
      var merged = Object.assign({}, current, liveResults)
      await dbSaveResults(merged)
      setResults(merged)
    }
  }

  async function fetchAll() {
    setLoading(true)
    var rows = await dbGetAll()
    var res = await dbGetResults()
    setPlayers(rows)
    setResults(res)
    setLoading(false)
  }

  async function handleJoin() {
    var name = nameInput.trim()
    var pass = passInput.trim()
    if (!name) { setError('Escribi tu nombre'); return }
    if (!pass) { setError('Escribi una contrasena'); return }
    setError('')
    setLoading(true)
    var row = await dbGetOne(name)
    if (!row) {
      // nuevo jugador
      var newProde = emptyProde()
      newProde._pass = pass
      await dbUpsert(name, newProde)
      row = await dbGetOne(name)
    } else {
      // jugador existente: verificar contrasena
      if (row.prode._pass !== pass) {
        setError('Contrasena incorrecta')
        setLoading(false)
        return
      }
    }
    setPlayer(name)
    setProdeState(row.prode)
    await fetchAll()
    setScreen(name===ADMIN?'admin':'prode')
    setNameInput('')
    setPassInput('')
    setActiveTab('groups')
    setLoading(false)
  }

  async function saveProde(newProde) {
    setProdeState(newProde)
    setSaving(true)
    await dbUpsert(currentPlayer, newProde)
    setSaving(false)
    fetchAll()
  }

  async function saveResults(newResults) {
    setResults(newResults)
    await dbSaveResults(newResults)
    fetchAll()
  }

  // HOME ── ahora con botón En Vivo
  if (screen==='home') {
    var sorted = [...players].sort(function(a,b){return calcScore(b.prode,results)-calcScore(a.prode,results)})
    return (
      <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
        <div style={sHeader}>
          <div style={{fontSize:38,marginBottom:4}}>&#127942;</div>
          <div style={{fontSize:22,fontWeight:600}}>PRODE MUNDIAL 2026</div>
          <div style={{fontSize:13,opacity:.9,marginTop:4}}>USA - Mexico - Canada</div>
          <button onClick={function(){setScreen('live')}} style={{background:'rgba(255,255,255,.25)',color:'#fff',border:'2px solid rgba(255,255,255,.6)',borderRadius:10,padding:'6px 20px',cursor:'pointer',fontSize:13,fontWeight:600,marginTop:10}}>
            Ver partidos en vivo
          </button>
        </div>

        <div style={{...sCard,padding:'20px 16px',marginTop:10}}>
          <div style={{fontSize:15,fontWeight:500,color:C.blue,marginBottom:12,textAlign:'center'}}>Entrar al prode</div>
          <input style={{...sInput,marginBottom:8}} placeholder="Tu nombre" value={nameInput} onChange={function(e){setNameInput(e.target.value)}} />
          <input style={sInput} placeholder="Tu contrasena" type="password" value={passInput} onChange={function(e){setPassInput(e.target.value)}} onKeyDown={function(e){if(e.key==='Enter')handleJoin()}} />
          {error && <div style={{color:C.red,fontSize:13,marginTop:6,textAlign:'center'}}>{error}</div>}
          <button style={sBtn()} onClick={handleJoin} disabled={loading}>{loading?'Cargando...':'Entrar al prode!'}</button>
        </div>

        {sorted.length>0 && (
          <div style={{...sCard,padding:'14px 16px',marginTop:8}}>
            <div style={{fontSize:14,fontWeight:500,color:C.red,marginBottom:10}}>Ranking ({sorted.length} jugadores)</div>
            {sorted.map(function(p,i){
              var sc=calcScore(p.prode,results)
              var ch=p.prode.final&&p.prode.final.final_m
              return(
                <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:'1px solid '+C.border,fontSize:13}}>
                  <span style={{fontSize:16,minWidth:26}}>{i===0?'&#127941;':i===1?'&#129352;':i===2?'&#129353;':(i+1)+'.'}</span>
                  <div style={{flex:1}}>
                    <span style={{fontWeight:600}}>{p.player_name}</span>
                    {ch&&<span style={{fontSize:11,color:C.gray,marginLeft:6}}>{ch.n}</span>}
                  </div>
                  <span style={{fontWeight:700,color:C.blue,fontSize:14}}>{sc} pts</span>
                  <button onClick={async function(){
                    setLoading(true)
                    var row=await dbGetOne(p.player_name)
                    setPlayer(p.player_name)
                    setProdeState(row?row.prode:emptyProde())
                    setScreen('view')
                    setActiveTab('groups')
                    setLoading(false)
                  }} style={sSmallBtn(C.blue)}>Ver</button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── LIVE ──
  if (screen==='live') {
    return <LiveScreen setScreen={setScreen} />
  }

  // ── VIEW (solo lectura) ──
  if (screen==='view') {
    return (
      <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
        <div style={sHeader}>
          <div style={{fontSize:11,opacity:.8}}>Prode de</div>
          <div style={{fontSize:20,fontWeight:600}}>{currentPlayer}</div>
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
            <button onClick={function(){setScreen('home')}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Volver</button>
          </div>
        </div>
        <ProdeView prode={prode} results={results} readonly={true} activeTab={activeTab} setActiveTab={setActiveTab} />
        <ScoreSummary prode={prode} results={results} />
      </div>
    )
  }

  // ── ADMIN ──
  if (screen==='admin') {
    return <AdminPanel players={players} results={results} saveResults={saveResults} setScreen={setScreen} fetchAll={fetchAll} />
  }

  // ── PRODE (editable) ──
  var champ = prode.final&&prode.final.final_m
  return (
    <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:11,opacity:.8}}>Prode de</div>
        <div style={{fontSize:20,fontWeight:600}}>{currentPlayer}</div>
        {saving&&<div style={{fontSize:11,opacity:.8,marginTop:2}}>Guardando...</div>}
        <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
          <button onClick={function(){setScreen('home');fetchAll()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Inicio</button>
        </div>
      </div>
      {champ&&(
        <div style={{textAlign:'center',padding:'10px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:8,border:'2px solid '+C.gold}}>
          <img src={flag(champ.f)} alt={champ.n} style={{verticalAlign:'middle',marginRight:8}} />
          <span style={{fontSize:15,fontWeight:700,color:C.blue}}>{champ.n} - CAMPEON!</span>
        </div>
      )}
      <ProdeView prode={prode} results={results} readonly={false} setProde={saveProde} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScoreSummary prode={prode} results={results} />
    </div>
  )
}

// ── ProdeView ─────────────────────────────────────────────────
function ProdeView(props) {
  var prode=props.prode, results=props.results, readonly=props.readonly
  var setProde=props.setProde, activeTab=props.activeTab, setActiveTab=props.setActiveTab
  var tabs=[{id:'groups',label:'Grupos'},{id:'r32',label:'16avos'},{id:'r16',label:'Octavos'},{id:'qf',label:'Cuartos'},{id:'sf',label:'Semis'},{id:'final',label:'Final'}]
  return (
    <div>
      <div style={{display:'flex',gap:2}}>
        {tabs.map(function(t){return <button key={t.id} style={sTab(activeTab===t.id)} onClick={function(){setActiveTab(t.id)}}>{t.label}</button>})}
      </div>
      <div style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'0 0 10px 10px',padding:'10px 8px'}}>
        {activeTab==='groups'&&<GroupsTab prode={prode} setProde={setProde} readonly={readonly} />}
        {activeTab==='r32'&&<KnockoutTab round='r32' prode={prode} setProde={setProde} readonly={readonly} />}
        {activeTab==='r16'&&<KnockoutTab round='r16' prode={prode} setProde={setProde} readonly={readonly} />}
        {activeTab==='qf'&&<KnockoutTab round='qf' prode={prode} setProde={setProde} readonly={readonly} />}
        {activeTab==='sf'&&<KnockoutTab round='sf' prode={prode} setProde={setProde} readonly={readonly} />}
        {activeTab==='final'&&<FinalTab prode={prode} setProde={setProde} readonly={readonly} />}
      </div>
    </div>
  )
}

function ScoreSummary(props) {
  var prode=props.prode, results=props.results
  var sc=calcScore(prode,results)
  return (
    <div style={{textAlign:'center',marginTop:10,padding:'10px',background:'#f9f9f9',borderRadius:10}}>
      <div style={{fontSize:13,color:C.gray}}>Puntaje actual</div>
      <div style={{fontSize:28,fontWeight:700,color:C.blue}}>{sc} pts</div>
    </div>
  )
}

// ── Groups Tab ────────────────────────────────────────────────
function GroupsTab(props) {
  var prode=props.prode, setProde=props.setProde, readonly=props.readonly

  function toggleGroup(gName,idx) {
    if (readonly) return
    var g=GROUPS.find(function(x){return x.name===gName})
    var newG=Object.assign({},prode.groups)
    var k=gName+'_'+idx
    var cur=newG[k]
    var others=g.teams.map(function(_,i){return i}).filter(function(i){return i!==idx})
    if(!cur){
      if(!others.some(function(i){return newG[gName+'_'+i]===1}))newG[k]=1
      else if(!others.some(function(i){return newG[gName+'_'+i]===2}))newG[k]=2
    } else if(cur===1){
      if(!others.some(function(i){return newG[gName+'_'+i]===2}))newG[k]=2
      else delete newG[k]
    } else delete newG[k]
    setProde(Object.assign({},prode,{groups:newG}))
  }

  function setScore(matchId, side, val, matchDate) {
    if (readonly || isMatchLocked(matchDate)) return
    var newScores=Object.assign({},prode.scores)
    var cur=newScores[matchId]||{a:'',b:''}
    newScores[matchId]=Object.assign({},cur,{[side]:val})
    setProde(Object.assign({},prode,{scores:newScores}))
  }

  return (
    <div>
      <div style={{fontSize:11,color:C.gray,marginBottom:8}}>Clasificados: {Object.keys(prode.groups).length}/48 | Toca para elegir 1ro (dorado) o 2do (verde)</div>
      {GROUPS.map(function(g){
        var gMatches=GROUP_MATCHES.filter(function(m){return m.g===g.name})
        return(
          <div key={g.name} style={{...sCard,marginBottom:10}}>
            <div style={{background:C.blue,color:'#fff',padding:'5px 10px',fontSize:13,fontWeight:500,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span>GRUPO {g.name}</span>
              <span style={{fontSize:11,opacity:.8}}>{Object.keys(prode.groups).filter(function(k){return k.startsWith(g.name+'_')}).length}/2 clasificados</span>
            </div>
            {/* Equipos */}
            <div style={{padding:'4px 0'}}>
              {g.teams.map(function(t,i){
                var pos=prode.groups[g.name+'_'+i]
                return(
                  <div key={i} style={Object.assign({},sTeamRow(pos),{opacity:readonly&&!pos?0.6:1})} onClick={function(){toggleGroup(g.name,i)}}>
                    <img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}} />
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.n}</span>
                    {pos===1&&<span style={{fontSize:9,background:C.gold,color:'#4a2800',borderRadius:10,padding:'1px 5px'}}>1ro</span>}
                    {pos===2&&<span style={{fontSize:9,background:C.green,color:'#fff',borderRadius:10,padding:'1px 5px'}}>2do</span>}
                  </div>
                )
              })}
            </div>
            {/* Partidos con marcador */}
            <div style={{borderTop:'1px solid '+C.border,padding:'6px 8px'}}>
              <div style={{fontSize:11,color:C.gray,marginBottom:4}}>Marcadores pronosticados:</div>
              {gMatches.map(function(m){
                var locked=isMatchLocked(m.date)
                var tl=timeLeftStr(m.date)
                var ta=g.teams[m.a], tb=g.teams[m.b]
                var sc=prode.scores&&prode.scores[m.id]
                return(
                  <div key={m.id} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0',borderBottom:'1px solid #f0f0f0',fontSize:12}}>
                    <img src={flag(ta.f)} alt={ta.n} style={{width:16,height:11,objectFit:'cover'}} />
                    <span style={{width:70,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ta.n}</span>
                    <input type="number" min="0" max="20" value={sc?sc.a:''} onChange={function(e){setScore(m.id,'a',e.target.value,m.date)}}
                      disabled={locked||readonly} style={{width:32,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-" />
                    <span style={{color:C.gray}}>-</span>
                    <input type="number" min="0" max="20" value={sc?sc.b:''} onChange={function(e){setScore(m.id,'b',e.target.value,m.date)}}
                      disabled={locked||readonly} style={{width:32,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-" />
                    <img src={flag(tb.f)} alt={tb.n} style={{width:16,height:11,objectFit:'cover'}} />
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tb.n}</span>
                    {locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:10}}>{tl}</span>)}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Knockout Tab ──────────────────────────────────────────────
function KnockoutTab(props) {
  var round=props.round, prode=props.prode, setProde=props.setProde, readonly=props.readonly
  var locked=isRoundLocked(round)
  var tl=timeLeftStr(KNOCKOUT_DATES[round])
  var count=ROUND_COUNTS[round]
  var items=[]
  for(var i=0;i<count;i++){
    (function(idx){
      var id=round+'_'+idx
      var teams=getMatchTeams(prode,round,idx)
      var ta=teams[0],tb=teams[1]
      var w=prode[round][id]||null
      items.push(
        <div key={id} style={Object.assign({},sCard,{marginBottom:8})}>
          <div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>{ROUND_LABELS[round]} {idx+1}</div>
          {[ta,tb].map(function(t,ti){
            var isW=w&&t&&w.n===t.n
            return(
              <div key={ti} style={Object.assign({},sMatchTeam(isW),{cursor:(locked||!t||readonly)?'default':'pointer'})}
                onClick={function(){if(t&&!locked&&!readonly){var nr=Object.assign({},prode[round],{[id]:t});setProde(Object.assign({},prode,{[round]:nr}))}}}>
                {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}} /><span>{t.n}</span>{isW&&<span style={{marginLeft:'auto',color:C.blue}}>OK</span>}</>
                  :<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
              </div>
            )
          })}
        </div>
      )
    })(i)
  }
  return(
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
        {locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:12,fontWeight:500}}>{tl} para el cierre</span>)}
      </div>
      {items}
    </div>
  )
}

// ── Final Tab ─────────────────────────────────────────────────
function FinalTab(props) {
  var prode=props.prode, setProde=props.setProde, readonly=props.readonly
  var locked=isRoundLocked('final')
  var tl=timeLeftStr(KNOCKOUT_DATES.final)
  var sf0w=(prode.sf&&prode.sf.sf_0)||null
  var sf1w=(prode.sf&&prode.sf.sf_1)||null
  var qf0=(prode.qf&&prode.qf.qf_0)||null,qf1=(prode.qf&&prode.qf.qf_1)||null
  var qf2=(prode.qf&&prode.qf.qf_2)||null,qf3=(prode.qf&&prode.qf.qf_3)||null
  var loser0=sf0w?(sf0w.n===(qf0&&qf0.n)?qf1:qf0):null
  var loser1=sf1w?(sf1w.n===(qf2&&qf2.n)?qf3:qf2):null
  var champ=(prode.final&&prode.final.final_m)||null

  function pick(matchId,team,field){
    if(locked||readonly)return
    setProde(Object.assign({},prode,{[field]:Object.assign({},prode[field],{[matchId]:team})}))
  }

  function MatchRow(t,id,field,w){
    var isW=w&&t&&w.n===t.n
    return(
      <div style={Object.assign({},sMatchTeam(isW),{cursor:(locked||!t||readonly)?'default':'pointer'})}
        onClick={function(){if(t&&!locked&&!readonly)pick(id,t,field)}}>
        {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}} /><span>{t.n}</span>{isW&&<span style={{marginLeft:'auto'}}>OK</span>}</>
          :<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
      </div>
    )
  }

  return(
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
        {locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:12,fontWeight:500}}>{tl} para el cierre</span>)}
      </div>
      {champ&&(
        <div style={{textAlign:'center',padding:'14px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:12,border:'2px solid '+C.gold}}>
          <img src={flag(champ.f)} alt={champ.n} style={{width:36,height:27,objectFit:'cover',marginBottom:6}} />
          <div style={{fontSize:17,fontWeight:700,color:C.blue}}>{champ.n}</div>
          <div style={{fontSize:12,color:C.gray}}>Tu campeon Mundial 2026</div>
        </div>
      )}
      <div style={{fontSize:13,fontWeight:500,color:C.gray,marginBottom:6}}>3er Puesto</div>
      <div style={Object.assign({},sCard,{marginBottom:12})}>
        <div style={{background:'#888',color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>3er Puesto</div>
        {MatchRow(loser0,'third','third',(prode.third&&prode.third.third)||null)}
        {MatchRow(loser1,'third','third',(prode.third&&prode.third.third)||null)}
      </div>
      <div style={{fontSize:13,fontWeight:500,color:C.red,marginBottom:6}}>Gran Final</div>
      <div style={Object.assign({},sCard,{border:'2px solid '+C.gold})}>
        <div style={{background:C.gold,color:'#4a2800',fontSize:12,textAlign:'center',padding:'4px',fontWeight:600}}>FINAL MUNDIAL 2026</div>
        {MatchRow(sf0w,'final_m','final',(prode.final&&prode.final.final_m)||null)}
        {MatchRow(sf1w,'final_m','final',(prode.final&&prode.final.final_m)||null)}
      </div>
    </div>
  )
}

// ── Live Screen ───────────────────────────────────────────────
function LiveScreen(props) {
  var setScreen = props.setScreen
  var [matches, setMatches] = useState(null)
  var [loading, setLoading] = useState(true)
  var [lastUpdate, setLastUpdate] = useState(null)
  var [filter, setFilter] = useState('hoy')

  async function load() {
    setLoading(true)
    var data = await fetchLiveMatches()
    setMatches(data)
    setLastUpdate(new Date())
    setLoading(false)
  }

  useEffect(function(){
    load()
    var t = setInterval(load, 60000)
    return function(){ clearInterval(t) }
  },[])

  function statusLabel(m) {
    var s = m.status
    if (s==='FINISHED') return {text:'Finalizado', color:'#888'}
    if (s==='IN_PLAY') return {text:'EN VIVO', color:C.red}
    if (s==='PAUSED') return {text:'Descanso', color:C.gold}
    if (s==='TIMED'||s==='SCHEDULED') {
      var d = new Date(m.utcDate)
      return {text:d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})+' hs', color:C.blue}
    }
    return {text:s, color:C.gray}
  }

  function getScore(m) {
    if (m.status==='SCHEDULED'||m.status==='TIMED') return null
    var s = m.score.fullTime
    if (s.home===null) s = m.score.halfTime
    return s
  }

  function matchDate(m) { return new Date(m.utcDate) }

  var now = new Date()
  var todayStr = now.toDateString()

  var filtered = !matches ? [] : matches.filter(function(m){
    var md = matchDate(m)
    if (filter==='hoy') return md.toDateString()===todayStr
    if (filter==='vivo') return m.status==='IN_PLAY'||m.status==='PAUSED'
    if (filter==='proximos') return m.status==='SCHEDULED'||m.status==='TIMED'
    if (filter==='finalizados') return m.status==='FINISHED'
    return true
  }).sort(function(a,b){ return matchDate(a)-matchDate(b) })

  var filterBtns = [
    {id:'hoy',label:'Hoy'},
    {id:'vivo',label:'En Vivo'},
    {id:'proximos',label:'Proximos'},
    {id:'finalizados',label:'Finalizados'},
    {id:'todos',label:'Todos'},
  ]

  return (
    <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:18,fontWeight:600}}>Partidos Mundial 2026</div>
        {lastUpdate&&<div style={{fontSize:11,opacity:.8,marginTop:2}}>Actualizado: {lastUpdate.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} hs</div>}
        <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
          <button onClick={function(){setScreen('home')}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Volver</button>
          <button onClick={load} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Actualizar</button>
        </div>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:8,overflowX:'auto',paddingBottom:4}}>
        {filterBtns.map(function(b){
          return <button key={b.id} onClick={function(){setFilter(b.id)}} style={{
            padding:'6px 12px',border:'none',borderRadius:20,cursor:'pointer',fontSize:12,fontWeight:500,whiteSpace:'nowrap',
            background:filter===b.id?C.blue:'#eee',color:filter===b.id?'#fff':'#555'
          }}>{b.label}</button>
        })}
      </div>

      {loading && <div style={{textAlign:'center',padding:30,color:C.gray}}>Cargando partidos...</div>}

      {!loading && filtered.length===0 && (
        <div style={{textAlign:'center',padding:30,color:C.gray}}>
          {filter==='vivo'?'No hay partidos en vivo ahora':'No hay partidos en esta categoria'}
        </div>
      )}

      {!loading && filtered.map(function(m){
        var sl = statusLabel(m)
        var sc = getScore(m)
        var isLive = m.status==='IN_PLAY'||m.status==='PAUSED'
        var isFinished = m.status==='FINISHED'
        var md = matchDate(m)
        return (
          <div key={m.id} style={{...sCard,border:isLive?'2px solid '+C.red:'1px solid '+C.border}}>
            {isLive&&<div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'2px',fontWeight:600,letterSpacing:1}}>EN VIVO</div>}
            <div style={{padding:'10px 12px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <span style={{fontSize:11,color:sl.color,fontWeight:600}}>{sl.text}</span>
                <span style={{fontSize:11,color:C.gray}}>{m.stage&&m.stage.replace(/_/g,' ')}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{flex:1,textAlign:'right'}}>
                  <div style={{fontSize:14,fontWeight:isFinished||isLive?700:400}}>{m.homeTeam.name}</div>
                  {m.homeTeam.crest&&<img src={m.homeTeam.crest} alt="" style={{width:24,height:24,objectFit:'contain',marginTop:4}} />}
                </div>
                <div style={{minWidth:70,textAlign:'center'}}>
                  {sc ? (
                    <div style={{fontSize:24,fontWeight:700,color:isLive?C.red:isFinished?C.blue:'#333'}}>
                      {sc.home} - {sc.away}
                    </div>
                  ) : (
                    <div style={{fontSize:13,color:C.gray}}>
                      {md.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})}
                    </div>
                  )}
                </div>
                <div style={{flex:1,textAlign:'left'}}>
                  <div style={{fontSize:14,fontWeight:isFinished||isLive?700:400}}>{m.awayTeam.name}</div>
                  {m.awayTeam.crest&&<img src={m.awayTeam.crest} alt="" style={{width:24,height:24,objectFit:'contain',marginTop:4}} />}
                </div>
              </div>
              {m.venue&&<div style={{fontSize:11,color:C.gray,textAlign:'center',marginTop:6}}>{m.venue}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
function AdminPanel(props) {
  var players=props.players, results=props.results, saveResults=props.saveResults, setScreen=props.setScreen, fetchAll=props.fetchAll
  var [localResults,setLocalResults] = useState(results)
  var [activeTab,setActiveTab] = useState('ranking')
  var [saving,setSaving] = useState(false)

  var sorted=[...players].sort(function(a,b){return calcScore(b.prode,results)-calcScore(a.prode,results)})

  async function handleSave(){
    setSaving(true)
    await saveResults(localResults)
    setSaving(false)
  }

  function setResult(matchId,side,val){
    var cur=localResults[matchId]||{a:'',b:''}
    setLocalResults(Object.assign({},localResults,{[matchId]:Object.assign({},cur,{[side]:val})}))
  }

  return(
    <div style={{maxWidth:600,margin:'0 auto',padding:'8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:18,fontWeight:600}}>Panel Admin - Tomy</div>
        <button onClick={function(){setScreen('home');fetchAll()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12,marginTop:8}}>Volver al inicio</button>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:0}}>
        {['ranking','resultados','jugadores'].map(function(t){
          return <button key={t} style={sTab(activeTab===t)} onClick={function(){setActiveTab(t)}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        })}
      </div>

      <div style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'0 0 10px 10px',padding:'12px'}}>

        {activeTab==='ranking'&&(
          <div>
            <div style={{fontSize:14,fontWeight:500,color:C.blue,marginBottom:10}}>Ranking general ({players.length} jugadores)</div>
            {sorted.map(function(p,i){
              var sc=calcScore(p.prode,results)
              var ch=p.prode.final&&p.prode.final.final_m
              var grouped=Object.keys(p.prode.groups||{}).length
              return(
                <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'8px',background:i===0?'#fff8e1':i%2===0?'#fafafa':'#fff',borderRadius:8,marginBottom:4,fontSize:13}}>
                  <span style={{fontWeight:700,minWidth:24,color:i===0?C.gold:i===1?C.gray:C.border}}>{i+1}.</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600}}>{p.player_name}</div>
                    <div style={{fontSize:11,color:C.gray}}>
                      Grupos: {grouped}/48
                      {ch&&(' | Campeon: '+ch.n)}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:18,fontWeight:700,color:C.blue}}>{sc}</div>
                    <div style={{fontSize:10,color:C.gray}}>pts</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab==='jugadores'&&(
          <div>
            <div style={{fontSize:14,fontWeight:500,color:C.blue,marginBottom:10}}>Gestionar jugadores</div>
            {players.filter(function(p){return p.player_name!==ADMIN}).map(function(p){
              return(
                <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'8px',borderBottom:'1px solid '+C.border,fontSize:13}}>
                  <span style={{flex:1,fontWeight:500}}>{p.player_name}</span>
                  <span style={{color:C.blue,fontWeight:700}}>{calcScore(p.prode,results)} pts</span>
                  <button onClick={async function(){
                    if(!window.confirm('Borrar a '+p.player_name+'?'))return
                    await supabase.from('prodes').delete().eq('player_name',p.player_name)
                    fetchAll()
                  }} style={sSmallBtn(C.red)}>Borrar</button>
                </div>
              )
            })}
            <button onClick={async function(){
              if(!window.confirm('Borrar TODOS los jugadores? Esto no se puede deshacer.'))return
              await supabase.from('prodes').delete().neq('player_name',ADMIN)
              fetchAll()
            }} style={sBtn(C.red,{marginTop:16})}>Borrar todos los jugadores</button>
          </div>
        )}

        {activeTab==='resultados'&&(
          <div>
            <div style={{fontSize:14,fontWeight:500,color:C.blue,marginBottom:10}}>Cargar resultados reales</div>
            <div style={{fontSize:12,color:C.gray,marginBottom:6}}>Los resultados se sincronizan automaticamente cada 5 minutos desde football-data.org</div>
            <button onClick={async function(){
              setSaving(true)
              var liveResults = await fetchLiveResults()
              if (liveResults) {
                var current = await dbGetResults()
                var merged = Object.assign({}, current, liveResults)
                await saveResults(merged)
                alert('Resultados actualizados!')
              } else {
                alert('No se pudo conectar con la API. Intenta de nuevo.')
              }
              setSaving(false)
            }} style={sBtn(C.green,{marginBottom:12})} disabled={saving}>
              {saving ? 'Sincronizando...' : 'Sincronizar resultados ahora'}
            </button>
            <div style={{fontSize:12,color:C.gray,marginBottom:10}}>O cargalos manualmente (en penales ingresa el resultado del tiempo reglamentario):</div>
            {GROUPS.map(function(g){
              var gMatches=GROUP_MATCHES.filter(function(m){return m.g===g.name})
              return(
                <div key={g.name} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.blue,marginBottom:6,borderBottom:'1px solid '+C.border,paddingBottom:4}}>Grupo {g.name}</div>
                  {gMatches.map(function(m){
                    var ta=g.teams[m.a],tb=g.teams[m.b]
                    var r=localResults[m.id]||{a:'',b:''}
                    return(
                      <div key={m.id} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0',fontSize:12}}>
                        <img src={flag(ta.f)} alt={ta.n} style={{width:16,height:11,objectFit:'cover'}} />
                        <span style={{width:65,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ta.n}</span>
                        <input type="number" min="0" max="20" value={r.a} onChange={function(e){setResult(m.id,'a',e.target.value)}}
                          style={{width:34,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-" />
                        <span>-</span>
                        <input type="number" min="0" max="20" value={r.b} onChange={function(e){setResult(m.id,'b',e.target.value)}}
                          style={{width:34,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-" />
                        <img src={flag(tb.f)} alt={tb.n} style={{width:16,height:11,objectFit:'cover'}} />
                        <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tb.n}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <button style={sBtn(C.green)} onClick={handleSave} disabled={saving}>{saving?'Guardando...':'Guardar todos los resultados'}</button>
          </div>
        )}

      </div>
    </div>
  )
}
