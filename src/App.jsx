import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const GROUPS = [
  {name:'A',teams:[{f:'🇦🇷',n:'Argentina'},{f:'🇪🇨',n:'Ecuador'},{f:'🇨🇱',n:'Chile'},{f:'🇨🇦',n:'Canadá'}]},
  {name:'B',teams:[{f:'🇫🇷',n:'Francia'},{f:'🇺🇾',n:'Uruguay'},{f:'🇹🇿',n:'Tanzania'},{f:'🇺🇸',n:'EE.UU.'}]},
  {name:'C',teams:[{f:'🇧🇷',n:'Brasil'},{f:'🇸🇪',n:'Suecia'},{f:'🇨🇲',n:'Camerún'},{f:'🇲🇽',n:'México'}]},
  {name:'D',teams:[{f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',n:'Inglaterra'},{f:'🇦🇺',n:'Australia'},{f:'🇧🇪',n:'Bélgica'},{f:'🇯🇵',n:'Japón'}]},
  {name:'E',teams:[{f:'🇩🇪',n:'Alemania'},{f:'🇨🇴',n:'Colombia'},{f:'🇰🇷',n:'Corea del Sur'},{f:'🇪🇸',n:'España'}]},
  {name:'F',teams:[{f:'🇵🇹',n:'Portugal'},{f:'🇲🇦',n:'Marruecos'},{f:'🇨🇷',n:'Costa Rica'},{f:'🇵🇪',n:'Perú'}]},
  {name:'G',teams:[{f:'🇳🇱',n:'Países Bajos'},{f:'🇨🇮',n:'Costa de Marfil'},{f:'🇸🇳',n:'Senegal'},{f:'🇻🇪',n:'Venezuela'}]},
  {name:'H',teams:[{f:'🇵🇱',n:'Polonia'},{f:'🇸🇦',n:'Arabia Saudita'},{f:'🇷🇸',n:'Serbia'},{f:'🇨🇭',n:'Suiza'}]},
  {name:'I',teams:[{f:'🇵🇾',n:'Paraguay'},{f:'🇦🇹',n:'Austria'},{f:'🇿🇦',n:'Sudáfrica'},{f:'🇳🇿',n:'Nueva Zelanda'}]},
  {name:'J',teams:[{f:'🇹🇷',n:'Turquía'},{f:'🇺🇦',n:'Ucrania'},{f:'🇬🇭',n:'Ghana'},{f:'🇶🇦',n:'Qatar'}]},
  {name:'K',teams:[{f:'🇮🇷',n:'Irán'},{f:'🇸🇰',n:'Eslovaquia'},{f:'🇰🇪',n:'Kenia'},{f:'🇬🇷',n:'Grecia'}]},
  {name:'L',teams:[{f:'🇭🇷',n:'Croacia'},{f:'🇧🇾',n:'Bielorrusia'},{f:'🇵🇦',n:'Panamá'},{f:'🇪🇬',n:'Egipto'}]},
]

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
  const d = Math.floor(diff/86400000)
  const h = Math.floor((diff%86400000)/3600000)
  const m = Math.floor((diff%3600000)/60000)
  if (d > 0) return `${d}d ${h}h para el cierre`
  if (h > 0) return `${h}h ${m}m para el cierre`
  return `${m} minutos para el cierre`
}

function emptyProde() {
  return { groups:{}, r32:{}, r16:{}, qf:{}, sf:{}, third:{}, final:{} }
}

function calcScore(prode) {
  if (!prode) return 0
  let pts = 0
  pts += Object.keys(prode.groups||{}).length * 5
  const rounds = [{k:'r32',p:10},{k:'r16',p:15},{k:'qf',p:20},{k:'sf',p:25}]
  rounds.forEach(({k,p}) => { pts += Object.keys(prode[k]||{}).length * p })
  if (prode.third?.third) pts += 25
  if (prode.final?.final_m) pts += 50
  return pts
}

function getChampion(prode) { return prode?.final?.final_m || null }

const MEDAL = ['🥇','🥈','🥉']
const C = { red:'#C0392B', blue:'#1565C0', gold:'#F9A825', green:'#27ae60', border:'#e0e0e0' }

const s = {
  header: { background:'linear-gradient(135deg,#C0392B 0%,#1565C0 60%,#F9A825 100%)', padding:'16px', textAlign:'center', borderRadius:'14px', marginBottom:'8px', color:'#fff' },
  card: { background:'#fff', border:`1px solid ${C.border}`, borderRadius:'10px', overflow:'hidden', marginBottom:'8px' },
  tab: a => ({ flex:1, padding:'9px 2px', border:'none', borderRadius:'8px 8px 0 0', cursor:'pointer', fontSize:'11px', fontWeight:500, background:a?C.blue:'#eee', color:a?'#fff':'#555' }),
  teamRow: sel => ({ display:'flex', alignItems:'center', gap:'8px', padding:'7px 10px', cursor:'pointer', fontSize:'13px', borderBottom:`1px solid ${C.border}`, background:sel===1?'#fff8e1':sel===2?'#e8f5e9':'#fff', borderLeft:sel===1?`4px solid ${C.gold}`:sel===2?`4px solid ${C.green}`:'4px solid transparent' }),
  matchTeam: w => ({ display:'flex', alignItems:'center', gap:'8px', padding:'7px 10px', cursor:'pointer', fontSize:'13px', borderBottom:`1px solid ${C.border}`, background:w?'#e3f0fb':'#fff', borderLeft:w?`4px solid ${C.blue}`:'4px solid transparent', fontWeight:w?600:400 }),
  btn: col => ({ background:col||C.blue, color:'#fff', border:'none', borderRadius:'10px', padding:'10px 20px', cursor:'pointer', fontSize:'14px', fontWeight:500, width:'100%', marginTop:'8px' }),
  input: { width:'100%', padding:'12px 14px', fontSize:'18px', border:`2px solid ${C.blue}`, borderRadius:'12px', outline:'none', fontFamily:'inherit', textAlign:'center' },
  lockBadge: { display:'inline-block', background:'#ffecb3', color:'#7b5800', borderRadius:'20px', padding:'2px 10px', fontSize:'11px' },
}

// ── Supabase helpers ──────────────────────────────────────────
async function dbGetAll() {
  const { data, error } = await supabase.from('prodes').select('*').order('updated_at', { ascending:false })
  if (error) { console.error(error); return [] }
  return data
}

async function dbUpsert(playerName, prode) {
  const { error } = await supabase.from('prodes').upsert(
    { player_name: playerName, prode, updated_at: new Date().toISOString() },
    { onConflict: 'player_name' }
  )
  if (error) console.error(error)
}

async function dbGetOne(playerName) {
  const { data, error } = await supabase.from('prodes').select('*').eq('player_name', playerName).single()
  if (error) return null
  return data
}

// ── R32 pairs ─────────────────────────────────────────────────
const R32_PAIRS = [
  [{g:'A',p:1},{g:'B',p:2}],[{g:'C',p:1},{g:'D',p:2}],
  [{g:'E',p:1},{g:'F',p:2}],[{g:'G',p:1},{g:'H',p:2}],
  [{g:'I',p:1},{g:'J',p:2}],[{g:'K',p:1},{g:'L',p:2}],
  [{g:'B',p:1},{g:'A',p:2}],[{g:'D',p:1},{g:'C',p:2}],
  [{g:'F',p:1},{g:'E',p:2}],[{g:'H',p:1},{g:'G',p:2}],
  [{g:'J',p:1},{g:'I',p:2}],[{g:'L',p:1},{g:'K',p:2}],
  [null,null],[null,null],[null,null],[null,null],
]

function getGroupQualified(prode, gName, pos) {
  const g = GROUPS.find(x=>x.name===gName)
  if (!g) return null
  const idx = g.teams.findIndex((_,i)=>prode.groups[`${gName}_${i}`]===pos)
  return idx < 0 ? null : g.teams[idx]
}

function getMatchTeams(prode, round, idx) {
  if (round==='r32') {
    const pair = R32_PAIRS[idx]
    if (!pair[0]) return [null,null]
    return [getGroupQualified(prode,pair[0].g,pair[0].p), getGroupQualified(prode,pair[1].g,pair[1].p)]
  }
  if (round==='r16') return [prode.r32[`r32_${idx*2}`]||null, prode.r32[`r32_${idx*2+1}`]||null]
  if (round==='qf')  return [prode.r16[`r16_${idx*2}`]||null, prode.r16[`r16_${idx*2+1}`]||null]
  if (round==='sf')  return [prode.qf[`qf_${idx*2}`]||null,  prode.qf[`qf_${idx*2+1}`]||null]
  return [null,null]
}

const ROUND_COUNTS  = {r32:16,r16:8,qf:4,sf:2}
const ROUND_LABELS  = {r32:'Partido',r16:'Octavo',qf:'Cuarto',sf:'Semifinal'}

// ══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen]         = useState('home')
  const [currentPlayer, setPlayer]  = useState(null)
  const [prode, setProdeState]      = useState(emptyProde())
  const [nameInput, setNameInput]   = useState('')
  const [players, setPlayers]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [activeTab, setActiveTab]   = useState('groups')
  const [saving, setSaving]         = useState(false)

  useEffect(() => { fetchPlayers() }, [])

  async function fetchPlayers() {
    setLoading(true)
    const rows = await dbGetAll()
    setPlayers(rows)
    setLoading(false)
  }

  async function handleJoin() {
    const name = nameInput.trim()
    if (!name) return
    setLoading(true)
    let row = await dbGetOne(name)
    if (!row) {
      await dbUpsert(name, emptyProde())
      row = await dbGetOne(name)
    }
    setPlayer(name)
    setProdeState(row?.prode || emptyProde())
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
    const ranked = [...players].sort((a,b)=>calcScore(b.prode)-calcScore(a.prode))
    return (
      <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
        <div style={s.header}>
          <div style={{fontSize:20,fontWeight:600}}>🏅 Ranking General</div>
          <div style={{fontSize:12,opacity:.9,marginTop:2}}>Prode Mundial 2026</div>
        </div>
        <button onClick={fetchPlayers} style={{...s.btn(C.blue),marginBottom:8}}>🔄 Actualizar ranking</button>
        <div style={s.card}>
          {ranked.length===0 && <div style={{padding:20,textAlign:'center',color:'#888'}}>Nadie anotado todavía.</div>}
          {ranked.map((p,i)=>{
            const sc=calcScore(p.prode), ch=getChampion(p.prode)
            return (
              <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:i===0?'#fff8e1':i===1?'#f3f3f3':'#fff',borderBottom:`1px solid ${C.border}`,fontSize:14}}>
                <span style={{fontSize:22,minWidth:28}}>{MEDAL[i]||`${i+1}°`}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{p.player_name}</div>
                  <div style={{fontSize:12,color:'#888'}}>{ch?`Campeón: ${ch.f} ${ch.n}`:'Sin campeón aún'}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:20,fontWeight:700,color:C.blue}}>{sc}</div>
                  <div style={{fontSize:11,color:'#888'}}>puntos</div>
                </div>
              </div>
            )
          })}
        </div>
        <button style={s.btn(C.red)} onClick={()=>setScreen('home')}>← Volver</button>
      </div>
    )
  }

  if (screen === 'prode') {
    const tabs = [{id:'groups',label:'Grupos'},{id:'r32',label:'16avos'},{id:'r16',label:'Octavos'},{id:'qf',label:'Cuartos'},{id:'sf',label:'Semis'},{id:'final',label:'Final'}]
    const champ = getChampion(prode)
    return (
      <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
        <div style={s.header}>
          <div style={{fontSize:11,opacity:.8,marginBottom:2}}>Prode de</div>
          <div style={{fontSize:20,fontWeight:600}}>{currentPlayer} ⚽</div>
          {saving && <div style={{fontSize:11,opacity:.8,marginTop:4}}>Guardando...</div>}
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
            <button onClick={()=>{setScreen('home');fetchPlayers()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>← Inicio</button>
            <button onClick={()=>{setScreen('ranking');fetchPlayers()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>🏅 Ranking</button>
          </div>
        </div>

        {champ && (
          <div style={{textAlign:'center',padding:'12px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:8,border:`2px solid ${C.gold}`}}>
            <span style={{fontSize:28}}>{champ.f}</span>
            <span style={{fontSize:15,fontWeight:700,color:C.blue,marginLeft:8}}>{champ.n} 🏆</span>
          </div>
        )}

        <div style={{display:'flex',gap:2,marginTop:6}}>
          {tabs.map(t=><button key={t.id} style={s.tab(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}
        </div>

        <div style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:'0 0 10px 10px',padding:'10px 8px'}}>
          {activeTab==='groups' && <GroupsTab prode={prode} setProde={saveProde} />}
          {activeTab==='r32'    && <KnockoutTab round='r32' prode={prode} setProde={saveProde} />}
          {activeTab==='r16'    && <KnockoutTab round='r16' prode={prode} setProde={saveProde} />}
          {activeTab==='qf'     && <KnockoutTab round='qf'  prode={prode} setProde={saveProde} />}
          {activeTab==='sf'     && <KnockoutTab round='sf'  prode={prode} setProde={saveProde} />}
          {activeTab==='final'  && <FinalTab prode={prode} setProde={saveProde} />}
        </div>

        <div style={{textAlign:'center',marginTop:10,padding:'10px',background:'#f9f9f9',borderRadius:10}}>
          <div style={{fontSize:13,color:'#888'}}>Tu puntaje actual</div>
          <div style={{fontSize:28,fontWeight:700,color:C.blue}}>{calcScore(prode)} pts</div>
        </div>
      </div>
    )
  }

  // HOME
  return (
    <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
      <div style={s.header}>
        <div style={{fontSize:36,marginBottom:4}}>🏆</div>
        <div style={{fontSize:22,fontWeight:600,letterSpacing:1}}>PRODE MUNDIAL 2026</div>
        <div style={{fontSize:13,opacity:.9,marginTop:4}}>USA · México · Canadá</div>
      </div>

      <div style={{...s.card,padding:'20px 16px',marginTop:12}}>
        <div style={{fontSize:16,fontWeight:500,color:C.blue,marginBottom:12,textAlign:'center'}}>¿Cómo te llamás?</div>
        <input style={s.input} placeholder="Escribí tu nombre..." value={nameInput}
          onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleJoin()} autoFocus />
        <button style={s.btn()} onClick={handleJoin} disabled={loading}>
          {loading ? 'Cargando...' : '¡Entrar al prode! ⚽'}
        </button>
      </div>

      {players.length > 0 && (
        <div style={{...s.card,padding:'14px 16px',marginTop:8}}>
          <div style={{fontSize:14,fontWeight:500,color:C.red,marginBottom:10}}>
            Jugadores anotados ({players.length})
          </div>
          {[...players].sort((a,b)=>calcScore(b.prode)-calcScore(a.prode)).map((p,i)=>(
            <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:`1px solid ${C.border}`,fontSize:14}}>
              <span style={{fontSize:18}}>{MEDAL[i]||'⚽'}</span>
              <span style={{flex:1,fontWeight:500}}>{p.player_name}</span>
              <span style={{fontWeight:700,color:C.blue,fontSize:13}}>{calcScore(p.prode)} pts</span>
              <button onClick={async()=>{
                setLoading(true)
                const row = await dbGetOne(p.player_name)
                setPlayer(p.player_name)
                setProdeState(row?.prode||emptyProde())
                setScreen('prode')
                setActiveTab('groups')
                setLoading(false)
              }} style={{background:C.blue,color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>
                Ver prode
              </button>
            </div>
          ))}
          <button style={s.btn(C.red)} onClick={()=>{setScreen('ranking');fetchPlayers()}}>
            Ver ranking completo 🏅
          </button>
        </div>
      )}
    </div>
  )
}

// ── Groups ────────────────────────────────────────────────────
function GroupsTab({prode,setProde}) {
  const locked = isLocked('groups')
  const tl = timeLeft('groups')

  function toggle(gName,idx) {
    if (locked) return
    const g = GROUPS.find(x=>x.name===gName)
    const newG = {...prode.groups}
    const k = `${gName}_${idx}`
    const cur = newG[k]
    const others = g.teams.map((_,i)=>i).filter(i=>i!==idx)
    if (!cur) {
      if (!others.some(i=>newG[`${gName}_${i}`]===1)) newG[k]=1
      else if (!others.some(i=>newG[`${gName}_${i}`]===2)) newG[k]=2
    } else if (cur===1) {
      if (!others.some(i=>newG[`${gName}_${i}`]===2)) newG[k]=2
      else delete newG[k]
    } else delete newG[k]
    setProde({...prode,groups:newG})
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,fontSize:12}}>
        <span style={{color:'#888'}}>{Object.keys(prode.groups).length}/48 clasificados</span>
        {locked ? <span style={s.lockBadge}>🔒 Cerrado</span> : tl&&<span style={{color:C.gold,fontWeight:500}}>⏰ {tl}</span>}
      </div>
      <div style={{fontSize:11,color:'#888',marginBottom:8}}>
        Tocá: <span style={{background:'#fff8e1',padding:'1px 5px',borderRadius:4}}>1° dorado</span> → <span style={{background:'#e8f5e9',padding:'1px 5px',borderRadius:4}}>2° verde</span> → sin clasificar
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {GROUPS.map(g=>(
          <div key={g.name} style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
            <div style={{background:C.blue,color:'#fff',textAlign:'center',padding:'4px',fontSize:12,fontWeight:500}}>GRUPO {g.name}</div>
            {g.teams.map((t,i)=>{
              const pos = prode.groups[`${g.name}_${i}`]
              return (
                <div key={i} style={{...s.teamRow(pos),opacity:locked&&!pos?.0.6:1}} onClick={()=>toggle(g.name,i)}>
                  <span style={{fontSize:15}}>{t.f}</span>
                  <span style={{flex:1,fontSize:11,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.n}</span>
                  {pos===1&&<span style={{fontSize:9,background:C.gold,color:'#4a2800',borderRadius:10,padding:'1px 4px'}}>1°</span>}
                  {pos===2&&<span style={{fontSize:9,background:C.green,color:'#fff',borderRadius:10,padding:'1px 4px'}}>2°</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Knockout ──────────────────────────────────────────────────
function KnockoutTab({round,prode,setProde}) {
  const locked = isLocked(round)
  const tl = timeLeft(round)
  const count = ROUND_COUNTS[round]

  function pick(matchId,team) {
    if (locked) return
    setProde({...prode,[round]:{...prode[round],[matchId]:team}})
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
        {locked ? <span style={s.lockBadge}>🔒 Cerrado</span> : tl&&<span style={{color:C.gold,fontSize:12,fontWeight:500}}>⏰ {tl}</span>}
      </div>
      {Array.from({length:count},(_,i)=>{
        const id=`${round}_${i}`
        const [ta,tb]=getMatchTeams(prode,round,i)
        const w=prode[round][id]||null
        return (
          <div key={id} style={{...s.card,marginBottom:8}}>
            <div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>{ROUND_LABELS[round]} {i+1}</div>
            {[ta,tb].map((t,ti)=>(
              <div key={ti} style={{...s.matchTeam(w&&t&&w.n===t.n),cursor:locked||!t?'default':'pointer'}} onClick={()=>t&&!locked&&pick(id,t)}>
                {t ? <><span style={{fontSize:15}}>{t.f}</span><span>{t.n}</span>{w&&t&&w.n===t.n&&<span style={{marginLeft:'auto'}}>✓</span>}</>
                   : <span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ── Final ─────────────────────────────────────────────────────
function FinalTab({prode,setProde}) {
  const locked = isLocked('final')
  const tl = timeLeft('final')
  const sf0w=prode.sf['sf_0']||null, sf1w=prode.sf['sf_1']||null
  const loser0=sf0w?(sf0w.n===(prode.qf['qf_0']||{}).n?prode.qf['qf_1']:prode.qf['qf_0'])||null:null
  const loser1=sf1w?(sf1w.n===(prode.qf['qf_2']||{}).n?prode.qf['qf_3']:prode.qf['qf_2'])||null:null

  function pick(matchId,team,field) {
    if (locked) return
    setProde({...prode,[field]:{...prode[field],[matchId]:team}})
  }

  const champ=prode.final['final_m']||null

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
        {locked ? <span style={s.lockBadge}>🔒 Cerrado</span> : tl&&<span style={{color:C.gold,fontSize:12,fontWeight:500}}>⏰ {tl}</span>}
      </div>
      {champ&&(
        <div style={{textAlign:'center',padding:'16px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:12,border:`2px solid ${C.gold}`}}>
          <div style={{fontSize:44}}>{champ.f}</div>
          <div style={{fontSize:18,fontWeight:700,color:C.blue}}>{champ.n}</div>
          <div style={{fontSize:12,color:'#888',marginTop:4}}>Tu campeón 🏆</div>
        </div>
      )}
      <div style={{fontSize:13,fontWeight:500,color:'#888',marginBottom:6}}>3er Puesto</div>
      <div style={{...s.card,marginBottom:12}}>
        <div style={{background:'#888',color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>3er Puesto</div>
        {[loser0,loser1].map((t,ti)=>{
          const w=prode.third['third']||null
          return (
            <div key={ti} style={{...s.matchTeam(w&&t&&w.n===t.n),cursor:locked||!t?'default':'pointer'}} onClick={()=>t&&!locked&&pick('third',t,'third')}>
              {t?<><span style={{fontSize:15}}>{t.f}</span><span>{t.n}</span>{w&&t&&w.n===t.n&&<span style={{marginLeft:'auto'}}>✓</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
            </div>
          )
        })}
      </div>
      <div style={{fontSize:13,fontWeight:500,color:C.red,marginBottom:6}}>Gran Final 🏆</div>
      <div style={{...s.card,border:`2px solid ${C.gold}`}}>
        <div style={{background:C.gold,color:'#4a2800',fontSize:12,textAlign:'center',padding:'4px',fontWeight:600}}>FINAL MUNDIAL 2026</div>
        {[sf0w,sf1w].map((t,ti)=>{
          const w=prode.final['final_m']||null
          return (
            <div key={ti} style={{...s.matchTeam(w&&t&&w.n===t.n),cursor:locked||!t?'default':'pointer'}} onClick={()=>t&&!locked&&pick('final_m',t,'final')}>
              {t?<><span style={{fontSize:15}}>{t.f}</span><span style={{fontSize:14}}>{t.n}</span>{w&&t&&w.n===t.n&&<span style={{marginLeft:'auto',fontSize:14}}>🏆</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}