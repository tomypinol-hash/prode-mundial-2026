import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const GROUPS = [
  {name:'A',teams:[{f:'AR',n:'Argentina'},{f:'EC',n:'Ecuador'},{f:'CL',n:'Chile'},{f:'CA',n:'Canada'}]},
  {name:'B',teams:[{f:'FR',n:'Francia'},{f:'UY',n:'Uruguay'},{f:'TZ',n:'Tanzania'},{f:'US',n:'EE.UU.'}]},
  {name:'C',teams:[{f:'BR',n:'Brasil'},{f:'SE',n:'Suecia'},{f:'CM',n:'Camerun'},{f:'MX',n:'Mexico'}]},
  {name:'D',teams:[{f:'GB-ENG',n:'Inglaterra'},{f:'AU',n:'Australia'},{f:'BE',n:'Belgica'},{f:'JP',n:'Japon'}]},
  {name:'E',teams:[{f:'DE',n:'Alemania'},{f:'CO',n:'Colombia'},{f:'KR',n:'Corea del Sur'},{f:'ES',n:'Espana'}]},
  {name:'F',teams:[{f:'PT',n:'Portugal'},{f:'MA',n:'Marruecos'},{f:'CR',n:'Costa Rica'},{f:'PE',n:'Peru'}]},
  {name:'G',teams:[{f:'NL',n:'Paises Bajos'},{f:'CI',n:'Costa de Marfil'},{f:'SN',n:'Senegal'},{f:'VE',n:'Venezuela'}]},
  {name:'H',teams:[{f:'PL',n:'Polonia'},{f:'SA',n:'Arabia Saudita'},{f:'RS',n:'Serbia'},{f:'CH',n:'Suiza'}]},
  {name:'I',teams:[{f:'PY',n:'Paraguay'},{f:'AT',n:'Austria'},{f:'ZA',n:'Sudafrica'},{f:'NZ',n:'Nueva Zelanda'}]},
  {name:'J',teams:[{f:'TR',n:'Turquia'},{f:'UA',n:'Ucrania'},{f:'GH',n:'Ghana'},{f:'QA',n:'Qatar'}]},
  {name:'K',teams:[{f:'IR',n:'Iran'},{f:'SK',n:'Eslovaquia'},{f:'KE',n:'Kenia'},{f:'GR',n:'Grecia'}]},
  {name:'L',teams:[{f:'HR',n:'Croacia'},{f:'BY',n:'Bielorrusia'},{f:'PA',n:'Panama'},{f:'EG',n:'Egipto'}]},
]

function flag(code) {
  return `https://flagcdn.com/24x18/${code.toLowerCase().replace('gb-eng','gb')}.png`
}

const DEADLINES = {
  groups: new Date('2026-06-10T15:00:00-03:00'),
  r32:    new Date('2026-07-01T15:00:00-03:00'),
  r16:    new Date('2026-07-05T15:00:00-03:00'),
  qf:     new Date('2026-07-10T15:00:00-03:00'),
  sf:     new Date('2026-07-14T15:00:00-03:00'),
  final:  new Date('2026-07-18T15:00:00-03:00'),
}

function isLocked(phase) { return new Date() > DEADLINES[phase] }

function timeLeft(phase) {
  const diff = DEADLINES[phase] - new Date()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (d > 0) return d + 'd ' + h + 'h para el cierre'
  if (h > 0) return h + 'h ' + m + 'm para el cierre'
  return m + ' minutos para el cierre'
}

function emptyProde() {
  return { groups: {}, r32: {}, r16: {}, qf: {}, sf: {}, third: {}, final: {} }
}

function calcScore(prode) {
  if (!prode) return 0
  var pts = 0
  pts += Object.keys(prode.groups || {}).length * 5
  var rounds = [{k:'r32',p:10},{k:'r16',p:15},{k:'qf',p:20},{k:'sf',p:25}]
  rounds.forEach(function(r) { pts += Object.keys(prode[r.k] || {}).length * r.p })
  if (prode.third && prode.third.third) pts += 25
  if (prode.final && prode.final.final_m) pts += 50
  return pts
}

function getChampion(prode) {
  if (!prode || !prode.final) return null
  return prode.final.final_m || null
}

var MEDAL = ['1ro', '2do', '3ro']
var C = { red:'#C0392B', blue:'#1565C0', gold:'#F9A825', green:'#27ae60', border:'#e0e0e0' }

function styleTab(a) {
  return { flex:1, padding:'9px 2px', border:'none', borderRadius:'8px 8px 0 0', cursor:'pointer', fontSize:'11px', fontWeight:500, background:a?C.blue:'#eee', color:a?'#fff':'#555' }
}
function styleTeamRow(sel) {
  return { display:'flex', alignItems:'center', gap:'8px', padding:'7px 10px', cursor:'pointer', fontSize:'13px', borderBottom:'1px solid '+C.border, background:sel===1?'#fff8e1':sel===2?'#e8f5e9':'#fff', borderLeft:sel===1?'4px solid '+C.gold:sel===2?'4px solid '+C.green:'4px solid transparent' }
}
function styleMatchTeam(w) {
  return { display:'flex', alignItems:'center', gap:'8px', padding:'7px 10px', cursor:'pointer', fontSize:'13px', borderBottom:'1px solid '+C.border, background:w?'#e3f0fb':'#fff', borderLeft:w?'4px solid '+C.blue:'4px solid transparent', fontWeight:w?600:400 }
}
var sHeader = { background:'linear-gradient(135deg,#C0392B 0%,#1565C0 60%,#F9A825 100%)', padding:'16px', textAlign:'center', borderRadius:'14px', marginBottom:'8px', color:'#fff' }
var sCard = { background:'#fff', border:'1px solid '+C.border, borderRadius:'10px', overflow:'hidden', marginBottom:'8px' }
function sBtn(col) { return { background:col||C.blue, color:'#fff', border:'none', borderRadius:'10px', padding:'10px 20px', cursor:'pointer', fontSize:'14px', fontWeight:500, width:'100%', marginTop:'8px' } }
var sInput = { width:'100%', padding:'12px 14px', fontSize:'18px', border:'2px solid '+C.blue, borderRadius:'12px', outline:'none', fontFamily:'inherit', textAlign:'center' }
var sLock = { display:'inline-block', background:'#ffecb3', color:'#7b5800', borderRadius:'20px', padding:'2px 10px', fontSize:'11px' }

async function dbGetAll() {
  var res = await supabase.from('prodes').select('*').order('updated_at', { ascending: false })
  if (res.error) { console.error(res.error); return [] }
  return res.data
}
async function dbUpsert(playerName, prode) {
  var res = await supabase.from('prodes').upsert({ player_name: playerName, prode: prode, updated_at: new Date().toISOString() }, { onConflict: 'player_name' })
  if (res.error) console.error(res.error)
}
async function dbGetOne(playerName) {
  var res = await supabase.from('prodes').select('*').eq('player_name', playerName).single()
  if (res.error) return null
  return res.data
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

function getGroupQualified(prode, gName, pos) {
  var g = GROUPS.find(function(x) { return x.name === gName })
  if (!g) return null
  var idx = g.teams.findIndex(function(_, i) { return prode.groups[gName+'_'+i] === pos })
  return idx < 0 ? null : g.teams[idx]
}

function getMatchTeams(prode, round, idx) {
  if (round === 'r32') {
    var pair = R32_PAIRS[idx]
    if (!pair[0]) return [null, null]
    return [getGroupQualified(prode, pair[0].g, pair[0].p), getGroupQualified(prode, pair[1].g, pair[1].p)]
  }
  if (round === 'r16') return [prode.r32['r32_'+(idx*2)]||null, prode.r32['r32_'+(idx*2+1)]||null]
  if (round === 'qf')  return [prode.r16['r16_'+(idx*2)]||null, prode.r16['r16_'+(idx*2+1)]||null]
  if (round === 'sf')  return [prode.qf['qf_'+(idx*2)]||null,  prode.qf['qf_'+(idx*2+1)]||null]
  return [null, null]
}

var ROUND_COUNTS = {r32:16, r16:8, qf:4, sf:2}
var ROUND_LABELS = {r32:'Partido', r16:'Octavo', qf:'Cuarto', sf:'Semifinal'}

export default function App() {
  var [screen, setScreen] = useState('home')
  var [currentPlayer, setPlayer] = useState(null)
  var [prode, setProdeState] = useState(emptyProde())
  var [nameInput, setNameInput] = useState('')
  var [players, setPlayers] = useState([])
  var [loading, setLoading] = useState(false)
  var [activeTab, setActiveTab] = useState('groups')
  var [saving, setSaving] = useState(false)

  useEffect(function() { fetchPlayers() }, [])

  async function fetchPlayers() {
    setLoading(true)
    var rows = await dbGetAll()
    setPlayers(rows)
    setLoading(false)
  }

  async function handleJoin() {
    var name = nameInput.trim()
    if (!name) return
    setLoading(true)
    var row = await dbGetOne(name)
    if (!row) {
      await dbUpsert(name, emptyProde())
      row = await dbGetOne(name)
    }
    setPlayer(name)
    setProdeState(row ? row.prode : emptyProde())
    await fetchPlayers()
    setScreen('prode')
    setNameInput('')
    setActiveTab('groups')
    setLoading(false)
  }

  async function saveProde(newProde) {
    setProdeState(newProde)
    setSaving(true)
    await dbUpsert(currentPlayer, newProde)
    setSaving(false)
    fetchPlayers()
  }

  if (screen === 'ranking') {
    var ranked = [...players].sort(function(a,b){ return calcScore(b.prode)-calcScore(a.prode) })
    return (
      <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
        <div style={sHeader}>
          <div style={{fontSize:20,fontWeight:600}}>Ranking General</div>
          <div style={{fontSize:12,opacity:.9,marginTop:2}}>Prode Mundial 2026</div>
        </div>
        <button onClick={fetchPlayers} style={sBtn(C.blue)}>Actualizar ranking</button>
        <div style={{...sCard,marginTop:8}}>
          {ranked.length===0 && <div style={{padding:20,textAlign:'center',color:'#888'}}>Nadie anotado todavia.</div>}
          {ranked.map(function(p,i){
            var sc=calcScore(p.prode), ch=getChampion(p.prode)
            return (
              <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:i===0?'#fff8e1':i===1?'#f3f3f3':'#fff',borderBottom:'1px solid '+C.border,fontSize:14}}>
                <span style={{fontSize:18,minWidth:28}}>{MEDAL[i]||((i+1)+'.')}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{p.player_name}</div>
                  <div style={{fontSize:12,color:'#888'}}>{ch?'Campeon: '+ch.n:'Sin campeon aun'}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:20,fontWeight:700,color:C.blue}}>{sc}</div>
                  <div style={{fontSize:11,color:'#888'}}>puntos</div>
                </div>
              </div>
            )
          })}
        </div>
        <button style={sBtn(C.red)} onClick={function(){setScreen('home')}}>Volver</button>
      </div>
    )
  }

  if (screen === 'prode') {
    var tabs = [{id:'groups',label:'Grupos'},{id:'r32',label:'16avos'},{id:'r16',label:'Octavos'},{id:'qf',label:'Cuartos'},{id:'sf',label:'Semis'},{id:'final',label:'Final'}]
    var champ = getChampion(prode)
    return (
      <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
        <div style={sHeader}>
          <div style={{fontSize:11,opacity:.8,marginBottom:2}}>Prode de</div>
          <div style={{fontSize:20,fontWeight:600}}>{currentPlayer}</div>
          {saving && <div style={{fontSize:11,opacity:.8,marginTop:4}}>Guardando...</div>}
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
            <button onClick={function(){setScreen('home');fetchPlayers()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Inicio</button>
            <button onClick={function(){setScreen('ranking');fetchPlayers()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Ranking</button>
          </div>
        </div>
        {champ && (
          <div style={{textAlign:'center',padding:'12px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:8,border:'2px solid '+C.gold}}>
            <img src={flag(champ.f)} alt={champ.n} style={{marginRight:8,verticalAlign:'middle'}} />
            <span style={{fontSize:15,fontWeight:700,color:C.blue}}>{champ.n} - CAMPEON!</span>
          </div>
        )}
        <div style={{display:'flex',gap:2,marginTop:6}}>
          {tabs.map(function(t){ return <button key={t.id} style={styleTab(activeTab===t.id)} onClick={function(){setActiveTab(t.id)}}>{t.label}</button> })}
        </div>
        <div style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'0 0 10px 10px',padding:'10px 8px'}}>
          {activeTab==='groups' && <GroupsTab prode={prode} setProde={saveProde} />}
          {activeTab==='r32' && <KnockoutTab round='r32' prode={prode} setProde={saveProde} />}
          {activeTab==='r16' && <KnockoutTab round='r16' prode={prode} setProde={saveProde} />}
          {activeTab==='qf' && <KnockoutTab round='qf' prode={prode} setProde={saveProde} />}
          {activeTab==='sf' && <KnockoutTab round='sf' prode={prode} setProde={saveProde} />}
          {activeTab==='final' && <FinalTab prode={prode} setProde={saveProde} />}
        </div>
        <div style={{textAlign:'center',marginTop:10,padding:'10px',background:'#f9f9f9',borderRadius:10}}>
          <div style={{fontSize:13,color:'#888'}}>Tu puntaje actual</div>
          <div style={{fontSize:28,fontWeight:700,color:C.blue}}>{calcScore(prode)} pts</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:40,marginBottom:4}}>&#127942;</div>
        <div style={{fontSize:22,fontWeight:600,letterSpacing:1}}>PRODE MUNDIAL 2026</div>
        <div style={{fontSize:13,opacity:.9,marginTop:4}}>USA - Mexico - Canada</div>
      </div>
      <div style={{...sCard,padding:'20px 16px',marginTop:12}}>
        <div style={{fontSize:16,fontWeight:500,color:C.blue,marginBottom:12,textAlign:'center'}}>Como te llamas?</div>
        <input style={sInput} placeholder="Escribi tu nombre..." value={nameInput}
          onChange={function(e){setNameInput(e.target.value)}}
          onKeyDown={function(e){if(e.key==='Enter')handleJoin()}} autoFocus />
        <button style={sBtn()} onClick={handleJoin} disabled={loading}>
          {loading ? 'Cargando...' : 'Entrar al prode!'}
        </button>
      </div>
      {players.length > 0 && (
        <div style={{...sCard,padding:'14px 16px',marginTop:8}}>
          <div style={{fontSize:14,fontWeight:500,color:C.red,marginBottom:10}}>Jugadores anotados ({players.length})</div>
          {[...players].sort(function(a,b){return calcScore(b.prode)-calcScore(a.prode)}).map(function(p,i){
            return (
              <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid '+C.border,fontSize:14}}>
                <span style={{fontSize:18}}>{MEDAL[i]||'#'+(i+1)}</span>
                <span style={{flex:1,fontWeight:500}}>{p.player_name}</span>
                <span style={{fontWeight:700,color:C.blue,fontSize:13}}>{calcScore(p.prode)} pts</span>
                <button onClick={async function(){
                  setLoading(true)
                  var row = await dbGetOne(p.player_name)
                  setPlayer(p.player_name)
                  setProdeState(row ? row.prode : emptyProde())
                  setScreen('prode')
                  setActiveTab('groups')
                  setLoading(false)
                }} style={{background:C.blue,color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Ver prode</button>
              </div>
            )
          })}
          <button style={sBtn(C.red)} onClick={function(){setScreen('ranking');fetchPlayers()}}>Ver ranking completo</button>
        </div>
      )}
    </div>
  )
}

function GroupsTab(props) {
  var prode = props.prode, setProde = props.setProde
  var locked = isLocked('groups')
  var tl = timeLeft('groups')

  function toggle(gName, idx) {
    if (locked) return
    var g = GROUPS.find(function(x){return x.name===gName})
    var newG = Object.assign({}, prode.groups)
    var k = gName+'_'+idx
    var cur = newG[k]
    var others = g.teams.map(function(_,i){return i}).filter(function(i){return i!==idx})
    if (!cur) {
      if (!others.some(function(i){return newG[gName+'_'+i]===1})) newG[k]=1
      else if (!others.some(function(i){return newG[gName+'_'+i]===2})) newG[k]=2
    } else if (cur===1) {
      if (!others.some(function(i){return newG[gName+'_'+i]===2})) newG[k]=2
      else delete newG[k]
    } else delete newG[k]
    setProde(Object.assign({}, prode, {groups:newG}))
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,fontSize:12}}>
        <span style={{color:'#888'}}>{Object.keys(prode.groups).length}/48 clasificados</span>
        {locked ? <span style={sLock}>Cerrado</span> : (tl && <span style={{color:C.gold,fontWeight:500}}>{tl}</span>)}
      </div>
      <div style={{fontSize:11,color:'#888',marginBottom:8}}>
        Toca para elegir 1ro (dorado) o 2do (verde) de cada grupo
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {GROUPS.map(function(g){
          return (
            <div key={g.name} style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'10px',overflow:'hidden'}}>
              <div style={{background:C.blue,color:'#fff',textAlign:'center',padding:'4px',fontSize:12,fontWeight:500}}>GRUPO {g.name}</div>
              {g.teams.map(function(t,i){
                var pos = prode.groups[g.name+'_'+i]
                var opacity = (locked && !pos) ? 0.6 : 1
                return (
                  <div key={i} style={Object.assign({},styleTeamRow(pos),{opacity:opacity})} onClick={function(){toggle(g.name,i)}}>
                    <img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}} />
                    <span style={{flex:1,fontSize:11,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.n}</span>
                    {pos===1 && <span style={{fontSize:9,background:C.gold,color:'#4a2800',borderRadius:10,padding:'1px 4px'}}>1ro</span>}
                    {pos===2 && <span style={{fontSize:9,background:C.green,color:'#fff',borderRadius:10,padding:'1px 4px'}}>2do</span>}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KnockoutTab(props) {
  var round=props.round, prode=props.prode, setProde=props.setProde
  var locked = isLocked(round)
  var tl = timeLeft(round)
  var count = ROUND_COUNTS[round]

  function pick(matchId, team) {
    if (locked) return
    var newRound = Object.assign({}, prode[round], {[matchId]:team})
    setProde(Object.assign({}, prode, {[round]:newRound}))
  }

  var items = []
  for (var i=0; i<count; i++) {
    (function(idx){
      var id = round+'_'+idx
      var teams = getMatchTeams(prode, round, idx)
      var ta = teams[0], tb = teams[1]
      var w = prode[round][id] || null
      items.push(
        <div key={id} style={Object.assign({},sCard,{marginBottom:8})}>
          <div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>{ROUND_LABELS[round]} {idx+1}</div>
          {[ta,tb].map(function(t,ti){
            var isW = w && t && w.n===t.n
            return (
              <div key={ti} style={Object.assign({},styleMatchTeam(isW),{cursor:(locked||!t)?'default':'pointer'})}
                onClick={function(){if(t&&!locked)pick(id,t)}}>
                {t
                  ? <><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}} /><span>{t.n}</span>{isW&&<span style={{marginLeft:'auto'}}>OK</span>}</>
                  : <span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
              </div>
            )
          })}
        </div>
      )
    })(i)
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
        {locked ? <span style={sLock}>Cerrado</span> : (tl && <span style={{color:C.gold,fontSize:12,fontWeight:500}}>{tl}</span>)}
      </div>
      {items}
    </div>
  )
}

function FinalTab(props) {
  var prode=props.prode, setProde=props.setProde
  var locked = isLocked('final')
  var tl = timeLeft('final')
  var sf0w = (prode.sf&&prode.sf['sf_0'])||null
  var sf1w = (prode.sf&&prode.sf['sf_1'])||null
  var qf0=(prode.qf&&prode.qf['qf_0'])||null
  var qf1=(prode.qf&&prode.qf['qf_1'])||null
  var qf2=(prode.qf&&prode.qf['qf_2'])||null
  var qf3=(prode.qf&&prode.qf['qf_3'])||null
  var loser0=sf0w?(sf0w.n===(qf0&&qf0.n)?qf1:qf0):null
  var loser1=sf1w?(sf1w.n===(qf2&&qf2.n)?qf3:qf2):null
  var champ=(prode.final&&prode.final['final_m'])||null

  function pick(matchId,team,field){
    if(locked)return
    var newField=Object.assign({},prode[field],{[matchId]:team})
    setProde(Object.assign({},prode,{[field]:newField}))
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
        {locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:12,fontWeight:500}}>{tl}</span>)}
      </div>
      {champ&&(
        <div style={{textAlign:'center',padding:'16px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:12,border:'2px solid '+C.gold}}>
          <img src={flag(champ.f)} alt={champ.n} style={{width:40,height:30,objectFit:'cover',marginBottom:8}} />
          <div style={{fontSize:18,fontWeight:700,color:C.blue}}>{champ.n}</div>
          <div style={{fontSize:12,color:'#888',marginTop:4}}>Tu campeon Mundial 2026!</div>
        </div>
      )}
      <div style={{fontSize:13,fontWeight:500,color:'#888',marginBottom:6}}>3er Puesto</div>
      <div style={Object.assign({},sCard,{marginBottom:12})}>
        <div style={{background:'#888',color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>3er Puesto</div>
        {[loser0,loser1].map(function(t,ti){
          var w=(prode.third&&prode.third['third'])||null
          var isW=w&&t&&w.n===t.n
          return(
            <div key={ti} style={Object.assign({},styleMatchTeam(isW),{cursor:(locked||!t)?'default':'pointer'})}
              onClick={function(){if(t&&!locked)pick('third',t,'third')}}>
              {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}}/><span>{t.n}</span>{isW&&<span style={{marginLeft:'auto'}}>OK</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
            </div>
          )
        })}
      </div>
      <div style={{fontSize:13,fontWeight:500,color:C.red,marginBottom:6}}>Gran Final</div>
      <div style={Object.assign({},sCard,{border:'2px solid '+C.gold})}>
        <div style={{background:C.gold,color:'#4a2800',fontSize:12,textAlign:'center',padding:'4px',fontWeight:600}}>FINAL MUNDIAL 2026</div>
        {[sf0w,sf1w].map(function(t,ti){
          var w=(prode.final&&prode.final['final_m'])||null
          var isW=w&&t&&w.n===t.n
          return(
            <div key={ti} style={Object.assign({},styleMatchTeam(isW),{cursor:(locked||!t)?'default':'pointer'})}
              onClick={function(){if(t&&!locked)pick('final_m',t,'final')}}>
              {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}}/><span style={{fontSize:14}}>{t.n}</span>{isW&&<span style={{marginLeft:'auto',fontSize:14}}>CAMPEON</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
