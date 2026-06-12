import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// ── Mapeo equipos API → nuestros nombres ─────────────────────
// La API usa nombres en inglés, nosotros en español
const API_TEAM_MAP = {
  'Mexico':'Mexico','South Africa':'Sudafrica','South Korea':'Corea del Sur','Czech Republic':'Chequia',
  'Canada':'Canada','Bosnia & Herzegovina':'Bosnia','Qatar':'Qatar','Switzerland':'Suiza',
  'Brazil':'Brasil','Morocco':'Marruecos','Haiti':'Haiti','Scotland':'Escocia',
  'USA':'EE.UU.','Paraguay':'Paraguay','Australia':'Australia','Türkiye':'Turquia',
  'Germany':'Alemania','Ecuador':'Ecuador','Ivory Coast':'Costa de Marfil','Curaçao':'Curazao',
  'Netherlands':'Paises Bajos','Japan':'Japon','Tunisia':'Tunez','Sweden':'Suecia',
  'Belgium':'Belgica','Iran':'Iran','Egypt':'Egipto','New Zealand':'Nueva Zelanda',
  'Spain':'Espana','Uruguay':'Uruguay','Saudi Arabia':'Arabia Saudita','Cape Verde Islands':'Cabo Verde',
  'France':'Francia','Senegal':'Senegal','Norway':'Noruega','Iraq':'Irak',
  'Argentina':'Argentina','Algeria':'Argelia','Austria':'Austria','Jordan':'Jordania',
  'Portugal':'Portugal','Colombia':'Colombia','Uzbekistan':'Uzbekistan','Congo DR':'RD Congo',
  'England':'Inglaterra','Croatia':'Croacia','Ghana':'Ghana','Panama':'Panama',
}

// Mapeo inverso: nombre español → código de bandera
const NAME_TO_FLAG = {
  'Mexico':'mx','Sudafrica':'za','Corea del Sur':'kr','Chequia':'cz',
  'Canada':'ca','Bosnia':'ba','Qatar':'qa','Suiza':'ch',
  'Brasil':'br','Marruecos':'ma','Haiti':'ht','Escocia':'gb-sct',
  'EE.UU.':'us','Paraguay':'py','Australia':'au','Turquia':'tr',
  'Alemania':'de','Ecuador':'ec','Costa de Marfil':'ci','Curazao':'cw',
  'Paises Bajos':'nl','Japon':'jp','Tunez':'tn','Suecia':'se',
  'Belgica':'be','Iran':'ir','Egipto':'eg','Nueva Zelanda':'nz',
  'Espana':'es','Uruguay':'uy','Arabia Saudita':'sa','Cabo Verde':'cv',
  'Francia':'fr','Senegal':'sn','Noruega':'no','Irak':'iq',
  'Argentina':'ar','Argelia':'dz','Austria':'at','Jordania':'jo',
  'Portugal':'pt','Colombia':'co','Uzbekistan':'uz','RD Congo':'cd',
  'Inglaterra':'gb-eng','Croacia':'hr','Ghana':'gh','Panama':'pa',
}

const GROUPS = [
  {name:'A',teams:[{f:'mx',n:'Mexico'},{f:'za',n:'Sudafrica'},{f:'kr',n:'Corea del Sur'},{f:'cz',n:'Chequia'}]},
  {name:'B',teams:[{f:'ca',n:'Canada'},{f:'ch',n:'Suiza'},{f:'qa',n:'Qatar'},{f:'ba',n:'Bosnia'}]},
  {name:'C',teams:[{f:'br',n:'Brasil'},{f:'ma',n:'Marruecos'},{f:'ht',n:'Haiti'},{f:'gb-sct',n:'Escocia'}]},
  {name:'D',teams:[{f:'us',n:'EE.UU.'},{f:'py',n:'Paraguay'},{f:'au',n:'Australia'},{f:'tr',n:'Turquia'}]},
  {name:'E',teams:[{f:'de',n:'Alemania'},{f:'ec',n:'Ecuador'},{f:'ci',n:'Costa de Marfil'},{f:'cw',n:'Curazao'}]},
  {name:'F',teams:[{f:'nl',n:'Paises Bajos'},{f:'jp',n:'Japon'},{f:'tn',n:'Tunez'},{f:'se',n:'Suecia'}]},
  {name:'G',teams:[{f:'be',n:'Belgica'},{f:'ir',n:'Iran'},{f:'eg',n:'Egipto'},{f:'nz',n:'Nueva Zelanda'}]},
  {name:'H',teams:[{f:'es',n:'Espana'},{f:'uy',n:'Uruguay'},{f:'sa',n:'Arabia Saudita'},{f:'cv',n:'Cabo Verde'}]},
  {name:'I',teams:[{f:'fr',n:'Francia'},{f:'sn',n:'Senegal'},{f:'no',n:'Noruega'},{f:'iq',n:'Irak'}]},
  {name:'J',teams:[{f:'ar',n:'Argentina'},{f:'dz',n:'Argelia'},{f:'at',n:'Austria'},{f:'jo',n:'Jordania'}]},
  {name:'K',teams:[{f:'pt',n:'Portugal'},{f:'co',n:'Colombia'},{f:'uz',n:'Uzbekistan'},{f:'cd',n:'RD Congo'}]},
  {name:'L',teams:[{f:'gb-eng',n:'Inglaterra'},{f:'hr',n:'Croacia'},{f:'gh',n:'Ghana'},{f:'pa',n:'Panama'}]},
]

const GROUP_MATCHES = [
  {id:'gA1',g:'A',a:0,b:1,date:new Date('2026-06-11T16:00:00-03:00')},
  {id:'gA2',g:'A',a:2,b:3,date:new Date('2026-06-11T23:00:00-03:00')},
  {id:'gA3',g:'A',a:3,b:1,date:new Date('2026-06-18T13:00:00-03:00')},
  {id:'gA4',g:'A',a:0,b:2,date:new Date('2026-06-18T22:00:00-03:00')},
  {id:'gA5',g:'A',a:3,b:0,date:new Date('2026-06-24T22:00:00-03:00')},
  {id:'gA6',g:'A',a:1,b:2,date:new Date('2026-06-24T22:00:00-03:00')},
  {id:'gB1',g:'B',a:0,b:3,date:new Date('2026-06-12T16:00:00-03:00')},
  {id:'gB2',g:'B',a:2,b:1,date:new Date('2026-06-13T16:00:00-03:00')},
  {id:'gB3',g:'B',a:1,b:3,date:new Date('2026-06-18T16:00:00-03:00')},
  {id:'gB4',g:'B',a:0,b:2,date:new Date('2026-06-18T19:00:00-03:00')},
  {id:'gB5',g:'B',a:1,b:0,date:new Date('2026-06-24T16:00:00-03:00')},
  {id:'gB6',g:'B',a:3,b:2,date:new Date('2026-06-24T16:00:00-03:00')},
  {id:'gC1',g:'C',a:0,b:1,date:new Date('2026-06-13T19:00:00-03:00')},
  {id:'gC2',g:'C',a:2,b:3,date:new Date('2026-06-13T22:00:00-03:00')},
  {id:'gC3',g:'C',a:3,b:1,date:new Date('2026-06-19T19:00:00-03:00')},
  {id:'gC4',g:'C',a:0,b:2,date:new Date('2026-06-19T21:30:00-03:00')},
  {id:'gC5',g:'C',a:3,b:0,date:new Date('2026-06-24T19:00:00-03:00')},
  {id:'gC6',g:'C',a:1,b:2,date:new Date('2026-06-24T19:00:00-03:00')},
  {id:'gD1',g:'D',a:0,b:1,date:new Date('2026-06-12T22:00:00-03:00')},
  {id:'gD2',g:'D',a:2,b:3,date:new Date('2026-06-14T01:00:00-03:00')},
  {id:'gD3',g:'D',a:0,b:2,date:new Date('2026-06-19T16:00:00-03:00')},
  {id:'gD4',g:'D',a:3,b:1,date:new Date('2026-06-20T00:00:00-03:00')},
  {id:'gD5',g:'D',a:3,b:0,date:new Date('2026-06-25T23:00:00-03:00')},
  {id:'gD6',g:'D',a:1,b:2,date:new Date('2026-06-25T23:00:00-03:00')},
  {id:'gE1',g:'E',a:0,b:3,date:new Date('2026-06-14T14:00:00-03:00')},
  {id:'gE2',g:'E',a:2,b:1,date:new Date('2026-06-14T20:00:00-03:00')},
  {id:'gE3',g:'E',a:0,b:2,date:new Date('2026-06-20T17:00:00-03:00')},
  {id:'gE4',g:'E',a:1,b:3,date:new Date('2026-06-20T21:00:00-03:00')},
  {id:'gE5',g:'E',a:3,b:2,date:new Date('2026-06-25T17:00:00-03:00')},
  {id:'gE6',g:'E',a:1,b:0,date:new Date('2026-06-25T17:00:00-03:00')},
  {id:'gF1',g:'F',a:0,b:1,date:new Date('2026-06-14T17:00:00-03:00')},
  {id:'gF2',g:'F',a:3,b:2,date:new Date('2026-06-14T23:00:00-03:00')},
  {id:'gF3',g:'F',a:0,b:3,date:new Date('2026-06-20T14:00:00-03:00')},
  {id:'gF4',g:'F',a:2,b:1,date:new Date('2026-06-21T01:00:00-03:00')},
  {id:'gF5',g:'F',a:1,b:3,date:new Date('2026-06-25T20:00:00-03:00')},
  {id:'gF6',g:'F',a:2,b:0,date:new Date('2026-06-25T20:00:00-03:00')},
  {id:'gG1',g:'G',a:0,b:2,date:new Date('2026-06-15T16:00:00-03:00')},
  {id:'gG2',g:'G',a:1,b:3,date:new Date('2026-06-15T22:00:00-03:00')},
  {id:'gG3',g:'G',a:0,b:1,date:new Date('2026-06-21T16:00:00-03:00')},
  {id:'gG4',g:'G',a:3,b:2,date:new Date('2026-06-21T22:00:00-03:00')},
  {id:'gG5',g:'G',a:2,b:1,date:new Date('2026-06-27T00:00:00-03:00')},
  {id:'gG6',g:'G',a:3,b:0,date:new Date('2026-06-27T00:00:00-03:00')},
  {id:'gH1',g:'H',a:0,b:3,date:new Date('2026-06-15T13:00:00-03:00')},
  {id:'gH2',g:'H',a:2,b:1,date:new Date('2026-06-15T19:00:00-03:00')},
  {id:'gH3',g:'H',a:0,b:2,date:new Date('2026-06-21T13:00:00-03:00')},
  {id:'gH4',g:'H',a:1,b:3,date:new Date('2026-06-21T19:00:00-03:00')},
  {id:'gH5',g:'H',a:3,b:2,date:new Date('2026-06-26T21:00:00-03:00')},
  {id:'gH6',g:'H',a:1,b:0,date:new Date('2026-06-26T21:00:00-03:00')},
  {id:'gI1',g:'I',a:0,b:1,date:new Date('2026-06-16T16:00:00-03:00')},
  {id:'gI2',g:'I',a:3,b:2,date:new Date('2026-06-16T19:00:00-03:00')},
  {id:'gI3',g:'I',a:0,b:3,date:new Date('2026-06-22T18:00:00-03:00')},
  {id:'gI4',g:'I',a:2,b:1,date:new Date('2026-06-22T21:00:00-03:00')},
  {id:'gI5',g:'I',a:2,b:0,date:new Date('2026-06-26T16:00:00-03:00')},
  {id:'gI6',g:'I',a:1,b:3,date:new Date('2026-06-26T16:00:00-03:00')},
  {id:'gJ1',g:'J',a:0,b:1,date:new Date('2026-06-16T22:00:00-03:00')},
  {id:'gJ2',g:'J',a:2,b:3,date:new Date('2026-06-17T01:00:00-03:00')},
  {id:'gJ3',g:'J',a:0,b:2,date:new Date('2026-06-22T14:00:00-03:00')},
  {id:'gJ4',g:'J',a:3,b:1,date:new Date('2026-06-23T00:00:00-03:00')},
  {id:'gJ5',g:'J',a:1,b:2,date:new Date('2026-06-27T23:00:00-03:00')},
  {id:'gJ6',g:'J',a:3,b:0,date:new Date('2026-06-27T23:00:00-03:00')},
  {id:'gK1',g:'K',a:0,b:3,date:new Date('2026-06-17T14:00:00-03:00')},
  {id:'gK2',g:'K',a:2,b:1,date:new Date('2026-06-17T23:00:00-03:00')},
  {id:'gK3',g:'K',a:0,b:2,date:new Date('2026-06-23T14:00:00-03:00')},
  {id:'gK4',g:'K',a:1,b:3,date:new Date('2026-06-23T23:00:00-03:00')},
  {id:'gK5',g:'K',a:1,b:0,date:new Date('2026-06-27T20:30:00-03:00')},
  {id:'gK6',g:'K',a:3,b:2,date:new Date('2026-06-27T20:30:00-03:00')},
  {id:'gL1',g:'L',a:0,b:1,date:new Date('2026-06-17T17:00:00-03:00')},
  {id:'gL2',g:'L',a:2,b:3,date:new Date('2026-06-17T20:00:00-03:00')},
  {id:'gL3',g:'L',a:0,b:2,date:new Date('2026-06-23T17:00:00-03:00')},
  {id:'gL4',g:'L',a:3,b:1,date:new Date('2026-06-23T20:00:00-03:00')},
  {id:'gL5',g:'L',a:3,b:0,date:new Date('2026-06-27T18:00:00-03:00')},
  {id:'gL6',g:'L',a:1,b:2,date:new Date('2026-06-27T18:00:00-03:00')},
]

const KNOCKOUT_DATES = {
  r32:   new Date('2026-06-28T17:00:00-03:00'),
  r16:   new Date('2026-07-04T17:00:00-03:00'),
  qf:    new Date('2026-07-09T17:00:00-03:00'),
  sf:    new Date('2026-07-14T17:00:00-03:00'),
  final: new Date('2026-07-18T17:00:00-03:00'),
}

const LOCK_MINS = 20
const ADMIN = 'Tomy'
const ALLOWED_PLAYERS = [
  'Tomy','FedeBeltrami','Nico','Gaston','Bola',
  'Tomy ( Jugador)','Santi','Roman 🌎 💂','EPI','Federico'
]
const WC_LEAGUE = 1
const WC_SEASON = 2026

function isMatchLocked(date) { return new Date() > new Date(date.getTime() - LOCK_MINS*60000) }
function isRoundLocked(round) { return new Date() > new Date(KNOCKOUT_DATES[round].getTime() - LOCK_MINS*60000) }
function timeLeftStr(date) {
  const diff = new Date(date.getTime() - LOCK_MINS*60000) - new Date()
  if (diff<=0) return null
  const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000)
  if(d>0)return d+'d '+h+'h'; if(h>0)return h+'h '+m+'m'; return m+' min'
}

function flag(code) { return 'https://flagcdn.com/24x18/'+code.toLowerCase()+'.png' }
function teamObj(apiName) {
  var n = API_TEAM_MAP[apiName]||apiName
  var f = NAME_TO_FLAG[n]||'un'
  return {n,f}
}

function emptyProde() {
  return {groups:{},scores:{},knockoutScores:{r32:{},r16:{},qf:{},sf:{},third:{},final:{}},r32:{},r16:{},qf:{},sf:{},third:{},final:{}}
}

// Calcula la tabla de posiciones de un grupo basándose en los marcadores pronosticados
function calcGroupTable(gName, scores) {
  var g = GROUPS.find(function(x){return x.name===gName})
  if(!g) return []
  var gMatches = GROUP_MATCHES.filter(function(m){return m.g===gName})
  
  // Inicializar tabla
  var table = g.teams.map(function(t,i){
    return {idx:i, n:t.n, f:t.f, pts:0, gf:0, ga:0, gd:0, played:0}
  })
  
  // Procesar cada partido
  gMatches.forEach(function(m){
    var sc = scores && scores[m.id]
    if(!sc || sc.a==='' || sc.b==='') return
    var ga = parseInt(sc.a), gb = parseInt(sc.b)
    if(isNaN(ga)||isNaN(gb)) return
    
    var teamA = table[m.a], teamB = table[m.b]
    teamA.gf+=ga; teamA.ga+=gb; teamA.gd+=ga-gb; teamA.played++
    teamB.gf+=gb; teamB.ga+=ga; teamB.gd+=gb-ga; teamB.played++
    
    if(ga>gb){ teamA.pts+=3 }
    else if(ga<gb){ teamB.pts+=3 }
    else { teamA.pts+=1; teamB.pts+=1 }
  })
  
  // Ordenar: pts desc, gd desc, gf desc
  table.sort(function(a,b){
    if(b.pts!==a.pts) return b.pts-a.pts
    if(b.gd!==a.gd) return b.gd-a.gd
    return b.gf-a.gf
  })
  
  return table
}

// Obtiene el clasificado de un grupo en una posición (1 o 2) basado en marcadores
function getClassifiedFromScores(prode, gName, pos) {
  var table = calcGroupTable(gName, prode.scores)
  if(!table||table.length<pos) return null
  var t = table[pos-1]
  if(t.played===0) return null // Sin partidos jugados aún
  var g = GROUPS.find(function(x){return x.name===gName})
  return g.teams[t.idx]
}

function calcMatchPoints(pred, real) {
  if(!pred||!real)return 0
  var pa=parseInt(pred.a),pb=parseInt(pred.b),ra=parseInt(real.a),rb=parseInt(real.b)
  if(isNaN(pa)||isNaN(pb)||isNaN(ra)||isNaN(rb))return 0
  if(pa===ra&&pb===rb)return 2
  var pw=pa>pb?'a':pa<pb?'b':'e',rw=ra>rb?'a':ra<rb?'b':'e'
  return pw===rw?1:0
}

function calcScore(prode, results) {
  if(!prode)return 0
  var pts=0; results=results||{}
  GROUP_MATCHES.forEach(function(m){ pts+=calcMatchPoints(prode.scores&&prode.scores[m.id],results[m.id]) })
  var rounds=[{k:'r32',p:1},{k:'r16',p:2},{k:'qf',p:3},{k:'sf',p:3},{k:'final',p:3}]
  rounds.forEach(function(r){
    var rd=prode[r.k]||{},ks=prode.knockoutScores&&prode.knockoutScores[r.k]||{}
    Object.keys(rd).forEach(function(id){
      var pred=rd[id],real=results[id],realScore=results[id+'_score']
      if(!pred||!real)return
      if(pred.n!==real.n)return
      var predSc=ks[id],exacto=false
      if(predSc&&realScore){
        var pa=parseInt(predSc.a),pb=parseInt(predSc.b),ra=parseInt(realScore.a),rb=parseInt(realScore.b)
        if(!isNaN(pa)&&!isNaN(pb)&&!isNaN(ra)&&!isNaN(rb)&&pa===ra&&pb===rb)exacto=true
      }
      pts+=exacto?r.p*2:r.p
    })
  })
  return pts
}

function getChampion(prode) { return prode&&prode.final&&prode.final.final_m||null }

var C={red:'#C0392B',blue:'#1565C0',gold:'#F9A825',green:'#27ae60',border:'#e0e0e0',gray:'#888'}
function sBtn(col,ex){return Object.assign({background:col||C.blue,color:'#fff',border:'none',borderRadius:'10px',padding:'10px 16px',cursor:'pointer',fontSize:'14px',fontWeight:500,width:'100%',marginTop:'8px'},ex||{})}
function sSmallBtn(col){return{background:col||C.blue,color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:12}}
var sHeader={background:'linear-gradient(135deg,#C0392B 0%,#1565C0 60%,#F9A825 100%)',padding:'16px',textAlign:'center',borderRadius:'14px',marginBottom:'8px',color:'#fff'}
var sCard={background:'#fff',border:'1px solid '+C.border,borderRadius:'10px',overflow:'hidden',marginBottom:'8px'}
var sInput={width:'100%',padding:'10px 12px',fontSize:'16px',border:'2px solid '+C.blue,borderRadius:'10px',outline:'none',fontFamily:'inherit'}
var sLock={display:'inline-block',background:'#ffecb3',color:'#7b5800',borderRadius:'20px',padding:'2px 8px',fontSize:'11px'}
function sTab(a){return{flex:1,padding:'8px 2px',border:'none',borderRadius:'8px 8px 0 0',cursor:'pointer',fontSize:'11px',fontWeight:500,background:a?C.blue:'#eee',color:a?'#fff':'#555'}}
function sTeamRow(sel){return{display:'flex',alignItems:'center',gap:'6px',padding:'6px 8px',cursor:'pointer',fontSize:'12px',borderBottom:'1px solid '+C.border,background:sel===1?'#fff8e1':sel===2?'#e8f5e9':'#fff',borderLeft:sel===1?'3px solid '+C.gold:sel===2?'3px solid '+C.green:'3px solid transparent'}}
function sMatchTeam(w){return{display:'flex',alignItems:'center',gap:'8px',padding:'7px 10px',cursor:'pointer',fontSize:'13px',borderBottom:'1px solid '+C.border,background:w?'#e3f0fb':'#fff',borderLeft:w?'4px solid '+C.blue:'4px solid transparent',fontWeight:w?600:400}}

// ── Supabase ──────────────────────────────────────────────────
async function dbGetAll(){var r=await supabase.from('prodes').select('*').order('updated_at',{ascending:false});return r.error?[]:r.data}
async function dbUpsert(name,prode){var r=await supabase.from('prodes').upsert({player_name:name,prode,updated_at:new Date().toISOString()},{onConflict:'player_name'});if(r.error)console.error(r.error)}
async function dbGetOne(name){var r=await supabase.from('prodes').select('*').eq('player_name',name).single();return r.error?null:r.data}
async function dbGetResults(){var r=await supabase.from('results').select('*').eq('id','main').single();return r.error?{}:r.data?r.data.data:{}}
async function dbSaveResults(data){var r=await supabase.from('results').upsert({id:'main',data,updated_at:new Date().toISOString()},{onConflict:'id'});if(r.error)console.error(r.error)}

// ── API Football proxy ────────────────────────────────────────
async function apiCall(endpoint){
  try{
    var r=await fetch('/api/football?endpoint='+encodeURIComponent(endpoint))
    if(!r.ok)return null
    var j=await r.json()
    if(j.errors&&Object.keys(j.errors).length>0){console.error('API error:',j.errors);return null}
    return j.response||null
  }catch(e){console.error(e);return null}
}

function mapStatus(s){
  if(s==='FT'||s==='AET'||s==='PEN')return 'FINISHED'
  if(s==='1H'||s==='2H'||s==='ET')return 'IN_PLAY'
  if(s==='HT')return 'PAUSED'
  if(s==='NS')return 'SCHEDULED'
  return 'TIMED'
}

// Trae resultados de grupos terminados y los mapea a nuestros IDs
async function fetchGroupResults(){
  var data=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON+'&status=FT')
  if(!data)return{}
  var results={}
  data.forEach(function(f){
    var ha=f.goals.home,hb=f.goals.away
    if(ha===null||hb===null)return
    var homeApiName=f.teams.home.name, awayApiName=f.teams.away.name
    var homeName=API_TEAM_MAP[homeApiName]||homeApiName
    var awayName=API_TEAM_MAP[awayApiName]||awayApiName
    GROUP_MATCHES.forEach(function(gm){
      var g=GROUPS.find(function(x){return x.name===gm.g})
      if(!g)return
      var ta=g.teams[gm.a].n,tb=g.teams[gm.b].n
      if(homeName===ta&&awayName===tb){
        results[gm.id]={a:String(ha),b:String(hb)}
      }
    })
  })
  return results
}

// Trae standings y arma clasificados reales por grupo
async function fetchRealStandings(){
  var data=await apiCall('standings?league='+WC_LEAGUE+'&season='+WC_SEASON)
  if(!data||!data[0])return null
  var standings=data[0].league.standings
  var classified={} // {A:{1:{n,f},2:{n,f}}, B:{...}, ...}
  var thirds=[] // Lista de mejores terceros

  standings.forEach(function(group){
    if(!group||!group[0])return
    var groupName=group[0].group
    if(groupName==='Ranking of third-placed teams'){
      // Top 8 terceros
      group.slice(0,8).forEach(function(t){
        var n=API_TEAM_MAP[t.team.name]||t.team.name
        thirds.push({n,f:NAME_TO_FLAG[n]||'un',pts:t.points,gd:t.goalsDiff,gf:t.all.goals.for,rank:t.rank})
      })
      return
    }
    // Extraer letra del grupo (ej: "Group A" → "A")
    var letter=groupName.replace('Group ','').trim()
    classified[letter]={}
    group.forEach(function(t){
      var n=API_TEAM_MAP[t.team.name]||t.team.name
      classified[letter][t.rank]={n,f:NAME_TO_FLAG[n]||'un',logo:t.team.logo}
    })
  })

  return{classified,thirds}
}

// Trae fixtures de eliminatorias y extrae resultados
async function fetchKnockoutResults(round){
  var roundMap={
    r32:'Round of 32',r16:'Round of 16',
    qf:'Quarter-finals',sf:'Semi-finals',final:'Final'
  }
  var data=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON+'&round='+encodeURIComponent(roundMap[round])+'&status=FT')
  if(!data)return{}
  var results={}
  data.forEach(function(f,i){
    var ha=f.goals.home,hb=f.goals.away
    if(ha===null||hb===null)return
    var id=round+'_'+i
    var winner=f.teams.home.winner?teamObj(f.teams.home.name):teamObj(f.teams.away.name)
    results[id]=winner
    results[id+'_score']={a:String(ha),b:String(hb)}
  })
  return results
}

// ── App principal ─────────────────────────────────────────────
export default function App(){
  var [screen,setScreen]=useState('home')
  var [currentPlayer,setPlayer]=useState(null)
  var [prode,setProdeState]=useState(emptyProde())
  var [nameInput,setNameInput]=useState('')
  var [passInput,setPassInput]=useState('')
  var [players,setPlayers]=useState([])
  var [results,setResults]=useState({})
  var [realStandings,setRealStandings]=useState(null) // clasificados reales de la API
  var [loading,setLoading]=useState(false)
  var [saving,setSaving]=useState(false)
  var [activeTab,setActiveTab]=useState('groups')
  var [error,setError]=useState('')

  useEffect(function(){
    fetchAll()
    var t=setInterval(syncAll,5*60*1000)
    return function(){clearInterval(t)}
  },[])

  async function fetchAll(){
    setLoading(true)
    var rows=await dbGetAll(),res=await dbGetResults()
    setPlayers(rows);setResults(res)
    // Cargar standings reales
    if(res.real_standings){setRealStandings(res.real_standings)}
    setLoading(false)
  }

  async function syncAll(){
    // 1. Resultados de grupos
    var groupRes=await fetchGroupResults()
    // 2. Standings reales
    var standings=await fetchRealStandings()
    // 3. Resultados de eliminatorias
    var koResults={}
    var rounds=['r32','r16','qf','sf','final']
    for(var i=0;i<rounds.length;i++){
      var kr=await fetchKnockoutResults(rounds[i])
      Object.assign(koResults,kr)
    }
    // Guardar todo junto
    var cur=await dbGetResults()
    var merged=Object.assign({},cur,groupRes,koResults)
    if(standings){merged.real_standings=standings;setRealStandings(standings)}
    await dbSaveResults(merged)
    setResults(merged)
  }

  async function handleJoin(){
    var name=nameInput.trim(),pass=passInput.trim()
    if(!name){setError('Escribi tu nombre');return}
    if(!pass){setError('Escribi una contrasena');return}
    // Verificar que el jugador está en la lista permitida
    if(!ALLOWED_PLAYERS.includes(name)){
      setError('Este nombre no está en la lista de jugadores. Contactá a Tomy.')
      setLoading(false);return
    }
    setError('');setLoading(true)
    var row=await dbGetOne(name)
    if(!row){var np=emptyProde();np._pass=pass;await dbUpsert(name,np);row=await dbGetOne(name)}
    else if(row.prode._pass!==pass){setError('Contrasena incorrecta');setLoading(false);return}
    setPlayer(name);setProdeState(row.prode);await fetchAll()
    setScreen(name===ADMIN?'admin':'prode');setNameInput('');setPassInput('');setActiveTab('groups');setLoading(false)
  }

  async function saveProde(newProde){setProdeState(newProde);setSaving(true);await dbUpsert(currentPlayer,newProde);setSaving(false);fetchAll()}
  async function saveResults(newResults){setResults(newResults);await dbSaveResults(newResults);fetchAll()}

  if(screen==='live')return <LiveScreen setScreen={setScreen}/>
  if(screen==='admin')return <AdminPanel players={players} results={results} saveResults={saveResults} setScreen={setScreen} fetchAll={fetchAll} syncAll={syncAll}/>

  if(screen==='view'){
    return(
      <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
        <div style={sHeader}>
          <div style={{fontSize:11,opacity:.8}}>Prode de</div>
          <div style={{fontSize:20,fontWeight:600}}>{currentPlayer}</div>
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
            <button onClick={function(){setScreen('home')}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Volver</button>
          </div>
        </div>
        <ProdeView prode={prode} results={results} realStandings={realStandings} readonly={true} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <div style={{textAlign:'center',marginTop:10,padding:'10px',background:'#f9f9f9',borderRadius:10}}>
          <div style={{fontSize:13,color:C.gray}}>Puntaje</div>
          <div style={{fontSize:28,fontWeight:700,color:C.blue}}>{calcScore(prode,results)} pts</div>
        </div>
      </div>
    )
  }

  if(screen==='prode'){
    var champ=getChampion(prode)
    return(
      <div style={{maxWidth:480,margin:'0 auto',padding:'8px'}}>
        <div style={sHeader}>
          <div style={{fontSize:11,opacity:.8}}>Prode de</div>
          <div style={{fontSize:20,fontWeight:600}}>{currentPlayer}</div>
          {saving&&<div style={{fontSize:11,opacity:.8,marginTop:2}}>Guardando...</div>}
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
            <button onClick={function(){setScreen('home');fetchAll()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Inicio</button>
            <button onClick={function(){setScreen('live')}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>En Vivo</button>
          </div>
        </div>
        {champ&&<div style={{textAlign:'center',padding:'10px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:8,border:'2px solid '+C.gold}}><img src={flag(champ.f)} alt={champ.n} style={{verticalAlign:'middle',marginRight:8}}/><span style={{fontSize:15,fontWeight:700,color:C.blue}}>{champ.n} - CAMPEON!</span></div>}
        <ProdeView prode={prode} results={results} realStandings={realStandings} readonly={false} setProde={saveProde} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <div style={{textAlign:'center',marginTop:10,padding:'10px',background:'#f9f9f9',borderRadius:10}}>
          <div style={{fontSize:13,color:C.gray}}>Tu puntaje</div>
          <div style={{fontSize:28,fontWeight:700,color:C.blue}}>{calcScore(prode,results)} pts</div>
        </div>
      </div>
    )
  }

  // HOME
  var sorted=[...players].sort(function(a,b){return calcScore(b.prode,results)-calcScore(a.prode,results)})
  return(
    <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:38,marginBottom:4}}>🏆</div>
        <div style={{fontSize:22,fontWeight:600}}>PRODE MUNDIAL 2026</div>
        <div style={{fontSize:13,opacity:.9,marginTop:4}}>USA - Mexico - Canada</div>
        <button onClick={function(){setScreen('live')}} style={{background:'rgba(255,255,255,.25)',color:'#fff',border:'2px solid rgba(255,255,255,.6)',borderRadius:10,padding:'6px 20px',cursor:'pointer',fontSize:13,fontWeight:600,marginTop:10}}>Ver partidos en vivo</button>
      </div>
      <div style={{...sCard,padding:'20px 16px',marginTop:10}}>
        <div style={{fontSize:15,fontWeight:500,color:C.blue,marginBottom:8,textAlign:'center'}}>Entrar al prode</div>
        <div style={{fontSize:11,color:C.gray,marginBottom:12,textAlign:'center',background:'#f9f9f9',padding:'6px 10px',borderRadius:8}}>
          ⚠️ El nombre de usuario debe ser exactamente igual al registrado (mayúsculas, espacios y caracteres incluidos)<br/>
          <span style={{fontSize:10,color:'#aaa',marginTop:4,display:'block'}}>PD: Roman, no hagas más usuarios, ya tenés uno 😅</span>
        </div>
        <input style={{...sInput,marginBottom:8}} placeholder="Tu nombre" value={nameInput} onChange={function(e){setNameInput(e.target.value)}}/>
        <input style={sInput} placeholder="Tu contrasena" type="password" value={passInput} onChange={function(e){setPassInput(e.target.value)}} onKeyDown={function(e){if(e.key==='Enter')handleJoin()}}/>
        {error&&<div style={{color:C.red,fontSize:13,marginTop:6,textAlign:'center'}}>{error}</div>}
        <button style={sBtn()} onClick={handleJoin} disabled={loading}>{loading?'Cargando...':'Entrar al prode!'}</button>
      </div>
      {sorted.length>0&&(
        <div style={{...sCard,padding:'14px 16px',marginTop:8}}>
          <div style={{fontSize:14,fontWeight:500,color:C.red,marginBottom:10}}>Ranking ({sorted.length} jugadores)</div>
          {sorted.map(function(p,i){
            var sc=calcScore(p.prode,results),ch=getChampion(p.prode)
            return(
              <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:'1px solid '+C.border,fontSize:13}}>
                <span style={{fontSize:16,minWidth:26}}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'.'}</span>
                <div style={{flex:1}}><span style={{fontWeight:600}}>{p.player_name}</span>{ch&&<span style={{fontSize:11,color:C.gray,marginLeft:6}}>{ch.n}</span>}</div>
                <span style={{fontWeight:700,color:C.blue,fontSize:14}}>{sc} pts</span>
                <button onClick={async function(){setLoading(true);var row=await dbGetOne(p.player_name);setPlayer(p.player_name);setProdeState(row?row.prode:emptyProde());setScreen('view');setActiveTab('groups');setLoading(false)}} style={sSmallBtn(C.blue)}>Ver</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── ProdeView ─────────────────────────────────────────────────
function ProdeView(props){
  var prode=props.prode,results=props.results,realStandings=props.realStandings
  var readonly=props.readonly,setProde=props.setProde,activeTab=props.activeTab,setActiveTab=props.setActiveTab
  var tabs=[{id:'groups',label:'Grupos'},{id:'r32',label:'16avos'},{id:'r16',label:'Octavos'},{id:'qf',label:'Cuartos'},{id:'sf',label:'Semis'},{id:'final',label:'Final'}]
  return(
    <div>
      <div style={{display:'flex',gap:2}}>{tabs.map(function(t){return <button key={t.id} style={sTab(activeTab===t.id)} onClick={function(){setActiveTab(t.id)}}>{t.label}</button>})}</div>
      <div style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'0 0 10px 10px',padding:'10px 8px'}}>
        {activeTab==='groups'&&<GroupsTab prode={prode} setProde={setProde} readonly={readonly} results={results}/>}
        {activeTab==='r32'&&<KnockoutTab round='r32' prode={prode} setProde={setProde} readonly={readonly} realStandings={realStandings}/>}
        {activeTab==='r16'&&<KnockoutTab round='r16' prode={prode} setProde={setProde} readonly={readonly} realStandings={realStandings}/>}
        {activeTab==='qf'&&<KnockoutTab round='qf' prode={prode} setProde={setProde} readonly={readonly} realStandings={realStandings}/>}
        {activeTab==='sf'&&<KnockoutTab round='sf' prode={prode} setProde={setProde} readonly={readonly} realStandings={realStandings}/>}
        {activeTab==='final'&&<FinalTab prode={prode} setProde={setProde} readonly={readonly} realStandings={realStandings}/>}
      </div>
    </div>
  )
}

// ── Groups Tab ────────────────────────────────────────────────
function GroupsTab(props){
  var prode=props.prode,setProde=props.setProde,readonly=props.readonly

  function setScore(matchId,side,val,matchDate){
    if(readonly||isMatchLocked(matchDate))return
    var newS=Object.assign({},prode.scores),cur=newS[matchId]||{a:'',b:''}
    newS[matchId]=Object.assign({},cur,{[side]:val});setProde(Object.assign({},prode,{scores:newS}))
  }

  return(
    <div>
      <div style={{background:'#e8f4fd',border:'1px solid '+C.blue,borderRadius:8,padding:'8px 12px',marginBottom:10,fontSize:11,color:C.blue}}>
        Pronosticá los marcadores — la tabla se calcula sola y arma los 16avos automáticamente
      </div>
      {GROUPS.map(function(g){
        var gMatches=GROUP_MATCHES.filter(function(m){return m.g===g.name})
        var table=calcGroupTable(g.name,prode.scores)
        var hasScores=table.some(function(t){return t.played>0})
        return(
          <div key={g.name} style={{...sCard,marginBottom:10}}>
            <div style={{background:C.blue,color:'#fff',padding:'5px 10px',fontSize:13,fontWeight:500}}>
              GRUPO {g.name}
            </div>
            {/* Tabla calculada automáticamente */}
            {hasScores&&(
              <div style={{padding:'4px 0',borderBottom:'1px solid '+C.border}}>
                <div style={{fontSize:10,color:C.gray,padding:'2px 8px'}}>Tabla según tus pronósticos:</div>
                {table.map(function(t,i){
                  var team=g.teams[t.idx]
                  return(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 8px',fontSize:12,background:i<2?'#f0f8ff':'#fff',borderBottom:'1px solid #f5f5f5'}}>
                      <span style={{minWidth:16,fontWeight:700,color:i===0?C.gold:i===1?C.green:C.gray}}>{i+1}</span>
                      <img src={flag(team.f)} alt="" style={{width:18,height:12}}/>
                      <span style={{flex:1}}>{team.n}</span>
                      <span style={{color:C.gray,fontSize:10}}>{t.pts}pts {t.gd>0?'+':''}{t.gd}dg</span>
                      {i<2&&<span style={{fontSize:9,background:i===0?C.gold:C.green,color:i===0?'#4a2800':'#fff',borderRadius:10,padding:'1px 5px'}}>{i===0?'1ro':'2do'}</span>}
                    </div>
                  )
                })}
              </div>
            )}
            {/* Marcadores */}
            <div style={{padding:'6px 8px'}}>
              <div style={{fontSize:11,color:C.gray,marginBottom:4}}>Pronosticá los marcadores:</div>
              {gMatches.map(function(m){
                var locked=isMatchLocked(m.date),tl=timeLeftStr(m.date),ta=g.teams[m.a],tb=g.teams[m.b],sc=prode.scores&&prode.scores[m.id]
                return(<div key={m.id} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0',borderBottom:'1px solid #f0f0f0',fontSize:12}}>
                  <img src={flag(ta.f)} alt={ta.n} style={{width:16,height:11,objectFit:'cover'}}/>
                  <span style={{width:70,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ta.n}</span>
                  <input type="number" min="0" max="20" value={sc?sc.a:''} onChange={function(e){setScore(m.id,'a',e.target.value,m.date)}} disabled={locked||readonly} style={{width:32,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
                  <span style={{color:C.gray}}>-</span>
                  <input type="number" min="0" max="20" value={sc?sc.b:''} onChange={function(e){setScore(m.id,'b',e.target.value,m.date)}} disabled={locked||readonly} style={{width:32,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
                  <img src={flag(tb.f)} alt={tb.n} style={{width:16,height:11,objectFit:'cover'}}/>
                  <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tb.n}</span>
                  {locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:10}}>{tl}</span>)}
                </div>)
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Knockout Tab ──────────────────────────────────────────────
// Los equipos vienen de realStandings (clasificados reales de la API)
// El jugador pronostica ganador y marcador
// Los ganadores pronosticados arman el bracket siguiente

var ROUND_32_PAIRS = [
  // [grupo_1ro, grupo_2do] — cruces oficiales del Mundial 2026
  ['A',1,'B',2],['C',1,'D',2],['E',1,'F',2],['G',1,'H',2],
  ['I',1,'J',2],['K',1,'L',2],
  ['B',1,'A',2],['D',1,'C',2],
  ['F',1,'E',2],['H',1,'G',2],
  ['J',1,'I',2],['L',1,'K',2],
  // 4 partidos de mejores terceros (se arman cuando termine la fase de grupos)
  ['3rd',0,'3rd',1],['3rd',2,'3rd',3],['3rd',4,'3rd',5],['3rd',6,'3rd',7],
]
var ROUND_COUNTS={r32:16,r16:8,qf:4,sf:2}
var ROUND_LABELS={r32:'Partido',r16:'Octavo',qf:'Cuarto',sf:'Semifinal'}

function getTeamsForMatch(round, idx, prode, realStandings){
  function getClassified(g, pos){
    // 1. Usar clasificados REALES de la API si están disponibles
    if(realStandings&&realStandings.classified&&realStandings.classified[g]&&realStandings.classified[g][pos]){
      return realStandings.classified[g][pos]
    }
    // 2. Calcular automáticamente desde los marcadores del jugador
    var fromScores = getClassifiedFromScores(prode, g, pos)
    if(fromScores) return fromScores
    // 3. Fallback: picks manuales del jugador (campo groups)
    var group=GROUPS.find(function(x){return x.name===g})
    if(!group)return null
    var i=group.teams.findIndex(function(_,i){return prode.groups[g+'_'+i]===pos})
    return i<0?null:group.teams[i]
  }
  function get3rd(idx){
    if(realStandings&&realStandings.thirds&&realStandings.thirds[idx]){
      return realStandings.thirds[idx]
    }
    return null
  }

  if(round==='r32'){
    var pair=ROUND_32_PAIRS[idx]
    if(!pair)return[null,null]
    if(pair[0]==='3rd'&&pair[2]==='3rd'){
      return[get3rd(pair[1]),get3rd(pair[3])]
    }
    return[getClassified(pair[0],pair[1]),getClassified(pair[2],pair[3])]
  }
  if(round==='r16')return[prode.r32['r32_'+(idx*2)]||null,prode.r32['r32_'+(idx*2+1)]||null]
  if(round==='qf')return[prode.r16['r16_'+(idx*2)]||null,prode.r16['r16_'+(idx*2+1)]||null]
  if(round==='sf')return[prode.qf['qf_'+(idx*2)]||null,prode.qf['qf_'+(idx*2+1)]||null]
  return[null,null]
}

function KnockoutTab(props){
  var round=props.round,prode=props.prode,setProde=props.setProde,readonly=props.readonly,realStandings=props.realStandings
  var locked=isRoundLocked(round),tl=timeLeftStr(KNOCKOUT_DATES[round]),count=ROUND_COUNTS[round],items=[]

  function setKnockoutScore(id,side,val){
    if(locked||readonly)return
    var ks=Object.assign({},prode.knockoutScores||{}),rs=Object.assign({},ks[round]||{})
    rs[id]=Object.assign({},rs[id]||{a:'',b:''},{[side]:val})
    ks[round]=rs;setProde(Object.assign({},prode,{knockoutScores:ks}))
  }

  for(var i=0;i<count;i++){
    (function(idx){
      var id=round+'_'+idx
      var teams=getTeamsForMatch(round,idx,prode,realStandings)
      var ta=teams[0],tb=teams[1],w=prode[round][id]||null
      var sc=(prode.knockoutScores&&prode.knockoutScores[round]&&prode.knockoutScores[round][id])||null
      items.push(<div key={id} style={Object.assign({},sCard,{marginBottom:8})}>
        <div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>{ROUND_LABELS[round]} {idx+1}</div>
        {[ta,tb].map(function(t,ti){
          var isW=w&&t&&w.n===t.n
          return(<div key={ti} style={Object.assign({},sMatchTeam(isW),{cursor:(locked||!t||readonly)?'default':'pointer'})} onClick={function(){if(t&&!locked&&!readonly){var nr=Object.assign({},prode[round],{[id]:t});setProde(Object.assign({},prode,{[round]:nr}))}}}>
            {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}}/><span style={{flex:1}}>{t.n}</span>{isW&&<span style={{color:C.blue,fontSize:11}}>✓</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
          </div>)
        })}
        {(ta&&tb)&&(
          <div style={{padding:'6px 10px',borderTop:'1px solid #f0f0f0',display:'flex',alignItems:'center',gap:6,fontSize:12}}>
            <span style={{color:C.gray,fontSize:11}}>Marcador:</span>
            <img src={flag(ta.f)} alt="" style={{width:16,height:11}}/>
            <input type="number" min="0" max="20" value={sc?sc.a:''} onChange={function(e){setKnockoutScore(id,'a',e.target.value)}} disabled={locked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <span style={{color:C.gray}}>-</span>
            <input type="number" min="0" max="20" value={sc?sc.b:''} onChange={function(e){setKnockoutScore(id,'b',e.target.value)}} disabled={locked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <img src={flag(tb.f)} alt="" style={{width:16,height:11}}/>
            {locked?<span style={{...sLock,marginLeft:'auto'}}>Cerrado</span>:tl&&<span style={{color:C.gold,fontSize:10,marginLeft:'auto'}}>{tl}</span>}
          </div>
        )}
      </div>)
    })(i)
  }
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        {locked?<span style={sLock}>Cerrado</span>:(tl?<span style={{color:C.gold,fontSize:12,fontWeight:500}}>{tl} para el cierre</span>:<span/>)}
        {realStandings?<span style={{fontSize:11,color:C.green}}>✅ Bracket con datos reales</span>:<span style={{fontSize:11,color:C.gold}}>⏳ Usando pronósticos</span>}
      </div>
      {items}
    </div>
  )
}

// ── Final Tab ─────────────────────────────────────────────────
function FinalTab(props){
  var prode=props.prode,setProde=props.setProde,readonly=props.readonly
  var locked=isRoundLocked('final'),tl=timeLeftStr(KNOCKOUT_DATES.final)
  var sf0w=(prode.sf&&prode.sf.sf_0)||null,sf1w=(prode.sf&&prode.sf.sf_1)||null
  var qf0=(prode.qf&&prode.qf.qf_0)||null,qf1=(prode.qf&&prode.qf.qf_1)||null
  var qf2=(prode.qf&&prode.qf.qf_2)||null,qf3=(prode.qf&&prode.qf.qf_3)||null
  var loser0=sf0w?(sf0w.n===(qf0&&qf0.n)?qf1:qf0):null
  var loser1=sf1w?(sf1w.n===(qf2&&qf2.n)?qf3:qf2):null
  var champ=(prode.final&&prode.final.final_m)||null
  var finalSc=(prode.knockoutScores&&prode.knockoutScores.final&&prode.knockoutScores.final.final_m)||null

  function pick(matchId,team,field){if(locked||readonly)return;setProde(Object.assign({},prode,{[field]:Object.assign({},prode[field],{[matchId]:team})}))}
  function setKScore(side,val){
    if(locked||readonly)return
    var ks=Object.assign({},prode.knockoutScores||{}),fn=Object.assign({},ks.final||{})
    fn.final_m=Object.assign({},fn.final_m||{a:'',b:''},{[side]:val})
    ks.final=fn;setProde(Object.assign({},prode,{knockoutScores:ks}))
  }
  function MRow(t,id,field,w){
    var isW=w&&t&&w.n===t.n
    return(<div style={Object.assign({},sMatchTeam(isW),{cursor:(locked||!t||readonly)?'default':'pointer'})} onClick={function(){if(t&&!locked&&!readonly)pick(id,t,field)}}>
      {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}}/><span style={{flex:1}}>{t.n}</span>{isW&&<span style={{color:C.blue,fontSize:11}}>✓</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
    </div>)
  }
  return(
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>{locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:12,fontWeight:500}}>{tl} para el cierre</span>)}</div>
      {champ&&<div style={{textAlign:'center',padding:'14px',background:'linear-gradient(135deg,rgba(192,57,43,.1),rgba(21,101,192,.1))',borderRadius:12,marginBottom:12,border:'2px solid '+C.gold}}><img src={flag(champ.f)} alt={champ.n} style={{width:36,height:27,objectFit:'cover',marginBottom:6}}/><div style={{fontSize:17,fontWeight:700,color:C.blue}}>{champ.n}</div><div style={{fontSize:12,color:C.gray}}>Tu campeon Mundial 2026</div></div>}
      <div style={{fontSize:13,fontWeight:500,color:C.gray,marginBottom:6}}>3er Puesto</div>
      <div style={Object.assign({},sCard,{marginBottom:12})}>
        <div style={{background:'#888',color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>3er Puesto</div>
        {MRow(loser0,'third','third',(prode.third&&prode.third.third)||null)}
        {MRow(loser1,'third','third',(prode.third&&prode.third.third)||null)}
      </div>
      <div style={{fontSize:13,fontWeight:500,color:C.red,marginBottom:6}}>Gran Final</div>
      <div style={Object.assign({},sCard,{border:'2px solid '+C.gold})}>
        <div style={{background:C.gold,color:'#4a2800',fontSize:12,textAlign:'center',padding:'4px',fontWeight:600}}>FINAL MUNDIAL 2026</div>
        {MRow(sf0w,'final_m','final',(prode.final&&prode.final.final_m)||null)}
        {MRow(sf1w,'final_m','final',(prode.final&&prode.final.final_m)||null)}
        {(sf0w&&sf1w)&&(
          <div style={{padding:'6px 10px',borderTop:'1px solid #f0f0f0',display:'flex',alignItems:'center',gap:6,fontSize:12}}>
            <span style={{color:C.gray,fontSize:11}}>Marcador:</span>
            <img src={flag((sf0w||{f:'ar'}).f)} alt="" style={{width:16,height:11}}/>
            <input type="number" min="0" max="20" value={finalSc?finalSc.a:''} onChange={function(e){setKScore('a',e.target.value)}} disabled={locked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <span style={{color:C.gray}}>-</span>
            <input type="number" min="0" max="20" value={finalSc?finalSc.b:''} onChange={function(e){setKScore('b',e.target.value)}} disabled={locked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <img src={flag((sf1w||{f:'fr'}).f)} alt="" style={{width:16,height:11}}/>
            {locked&&<span style={{...sLock,marginLeft:'auto'}}>Cerrado</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Admin Panel ───────────────────────────────────────────────
function AdminPanel(props){
  var players=props.players,results=props.results,saveResults=props.saveResults
  var setScreen=props.setScreen,fetchAll=props.fetchAll,syncAll=props.syncAll
  var [localResults,setLocalResults]=useState(results)
  var [activeTab,setActiveTab]=useState('ranking')
  var [saving,setSaving]=useState(false)
  var sorted=[...players].sort(function(a,b){return calcScore(b.prode,results)-calcScore(a.prode,results)})

  async function handleSave(){setSaving(true);await saveResults(localResults);setSaving(false)}
  async function handleSync(){
    setSaving(true)
    await syncAll()
    alert('Sincronizado correctamente!')
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
        <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:8}}>
          <button onClick={function(){setScreen('home');fetchAll()}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>Inicio</button>
          <button onClick={function(){setScreen('live')}} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer',fontSize:12}}>En Vivo</button>
        </div>
      </div>
      <div style={{display:'flex',gap:2,marginBottom:0}}>
        {['ranking','resultados','jugadores'].map(function(t){return <button key={t} style={sTab(activeTab===t)} onClick={function(){setActiveTab(t)}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>})}
      </div>
      <div style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'0 0 10px 10px',padding:'12px'}}>

        {activeTab==='ranking'&&(
          <div>
            <div style={{fontSize:14,fontWeight:500,color:C.blue,marginBottom:10}}>Ranking ({players.length} jugadores)</div>
            {sorted.map(function(p,i){var sc=calcScore(p.prode,results),ch=getChampion(p.prode);return(
              <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'8px',background:i===0?'#fff8e1':i%2===0?'#fafafa':'#fff',borderRadius:8,marginBottom:4,fontSize:13}}>
                <span style={{fontWeight:700,minWidth:24,color:i===0?C.gold:C.gray}}>{i+1}.</span>
                <div style={{flex:1}}><div style={{fontWeight:600}}>{p.player_name}</div><div style={{fontSize:11,color:C.gray}}>{ch?'Campeon: '+ch.n:'Sin campeon'}</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:18,fontWeight:700,color:C.blue}}>{sc}</div><div style={{fontSize:10,color:C.gray}}>pts</div></div>
              </div>
            )})}
          </div>
        )}

        {activeTab==='jugadores'&&(
          <div>
            <div style={{fontSize:14,fontWeight:500,color:C.blue,marginBottom:10}}>Gestionar jugadores</div>
            {players.filter(function(p){return p.player_name!==ADMIN}).map(function(p){return(
              <div key={p.player_name} style={{display:'flex',alignItems:'center',gap:8,padding:'8px',borderBottom:'1px solid '+C.border,fontSize:13}}>
                <span style={{flex:1,fontWeight:500}}>{p.player_name}</span>
                <span style={{color:C.blue,fontWeight:700}}>{calcScore(p.prode,results)} pts</span>
                <button onClick={async function(){if(!window.confirm('Borrar a '+p.player_name+'?'))return;await supabase.from('prodes').delete().eq('player_name',p.player_name);fetchAll()}} style={sSmallBtn(C.red)}>Borrar</button>
              </div>
            )})}
            <button onClick={async function(){if(!window.confirm('Borrar TODOS los jugadores?'))return;await supabase.from('prodes').delete().neq('player_name',ADMIN);fetchAll()}} style={sBtn(C.red,{marginTop:16})}>Borrar todos los jugadores</button>
          </div>
        )}

        {activeTab==='resultados'&&(
          <div>
            <div style={{fontSize:14,fontWeight:500,color:C.blue,marginBottom:6}}>Resultados y standings</div>
            <div style={{fontSize:12,color:C.gray,marginBottom:8}}>Se sincronizan automaticamente cada 5 minutos. Incluye grupos, standings y eliminatorias.</div>
            <button onClick={handleSync} style={sBtn(C.green,{marginBottom:12})} disabled={saving}>{saving?'Sincronizando...':'Sincronizar todo ahora'}</button>

            {results.real_standings&&(
              <div style={{background:'#eafff0',border:'1px solid '+C.green,borderRadius:8,padding:'10px',marginBottom:12,fontSize:12}}>
                <div style={{fontWeight:600,color:C.green,marginBottom:6}}>✅ Standings reales cargados</div>
                {Object.keys(results.real_standings.classified||{}).sort().map(function(g){
                  var c=results.real_standings.classified[g]
                  return(<div key={g} style={{marginBottom:2}}>
                    <span style={{fontWeight:500}}>Grupo {g}:</span> {c[1]&&c[1].n} (1ro) · {c[2]&&c[2].n} (2do)
                  </div>)
                })}
              </div>
            )}

            <div style={{fontSize:13,fontWeight:500,color:C.blue,marginBottom:8}}>Cargar manualmente (backup)</div>
            {GROUPS.map(function(g){
              var gMatches=GROUP_MATCHES.filter(function(m){return m.g===g.name})
              return(<div key={g.name} style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:C.blue,marginBottom:6,borderBottom:'1px solid '+C.border,paddingBottom:4}}>Grupo {g.name}</div>
                {gMatches.map(function(m){
                  var ta=g.teams[m.a],tb=g.teams[m.b],r=localResults[m.id]||{a:'',b:''}
                  return(<div key={m.id} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0',fontSize:12}}>
                    <img src={flag(ta.f)} alt={ta.n} style={{width:16,height:11,objectFit:'cover'}}/>
                    <span style={{width:65,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ta.n}</span>
                    <input type="number" min="0" max="20" value={r.a} onChange={function(e){setResult(m.id,'a',e.target.value)}} style={{width:34,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
                    <span>-</span>
                    <input type="number" min="0" max="20" value={r.b} onChange={function(e){setResult(m.id,'b',e.target.value)}} style={{width:34,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
                    <img src={flag(tb.f)} alt={tb.n} style={{width:16,height:11,objectFit:'cover'}}/>
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tb.n}</span>
                  </div>)
                })}
              </div>)
            })}
            <button style={sBtn(C.green)} onClick={handleSave} disabled={saving}>{saving?'Guardando...':'Guardar resultados manuales'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Live Screen ───────────────────────────────────────────────
function LiveScreen(props){
  var setScreen=props.setScreen
  var [matches,setMatches]=useState(null),[loading,setLoading]=useState(true),[lastUpdate,setLastUpdate]=useState(null),[filter,setFilter]=useState('hoy')

  async function load(){
    setLoading(true)
    var data=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON)
    if(data){
      setMatches(data.map(function(f){
        return{
          id:f.fixture.id,utcDate:f.fixture.date,
          status:mapStatus(f.fixture.status.short),
          stage:f.league.round,venue:f.fixture.venue.name,
          homeTeam:{name:f.teams.home.name,crest:f.teams.home.logo},
          awayTeam:{name:f.teams.away.name,crest:f.teams.away.logo},
          score:{fullTime:{home:f.goals.home,away:f.goals.away},halfTime:{home:f.score.halftime.home,away:f.score.halftime.away}}
        }
      }))
    }
    setLastUpdate(new Date());setLoading(false)
  }

  useEffect(function(){load();var t=setInterval(load,60000);return function(){clearInterval(t)}},[])

  function statusLabel(m){
    var s=m.status
    if(s==='FINISHED')return{text:'Finalizado',color:C.gray}
    if(s==='IN_PLAY')return{text:'EN VIVO',color:C.red}
    if(s==='PAUSED')return{text:'Descanso',color:C.gold}
    var d=new Date(m.utcDate);return{text:d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})+' hs',color:C.blue}
  }
  function getScore(m){if(m.status==='SCHEDULED'||m.status==='TIMED')return null;var s=m.score.fullTime;if(s.home===null)s=m.score.halfTime;return s}

  var now=new Date(),todayStr=now.toDateString()
  var filtered=!matches?[]:matches.filter(function(m){
    var md=new Date(m.utcDate)
    if(filter==='hoy')return md.toDateString()===todayStr
    if(filter==='vivo')return m.status==='IN_PLAY'||m.status==='PAUSED'
    if(filter==='proximos')return m.status==='SCHEDULED'||m.status==='TIMED'
    if(filter==='finalizados')return m.status==='FINISHED'
    return true
  }).sort(function(a,b){return new Date(a.utcDate)-new Date(b.utcDate)})

  var filterBtns=[{id:'hoy',label:'Hoy'},{id:'vivo',label:'En Vivo'},{id:'proximos',label:'Proximos'},{id:'finalizados',label:'Finalizados'},{id:'todos',label:'Todos'}]

  return(
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
        {filterBtns.map(function(b){return <button key={b.id} onClick={function(){setFilter(b.id)}} style={{padding:'6px 12px',border:'none',borderRadius:20,cursor:'pointer',fontSize:12,fontWeight:500,whiteSpace:'nowrap',background:filter===b.id?C.blue:'#eee',color:filter===b.id?'#fff':'#555'}}>{b.label}</button>})}
      </div>
      {loading&&<div style={{textAlign:'center',padding:30,color:C.gray}}>Cargando partidos...</div>}
      {!loading&&filtered.length===0&&<div style={{textAlign:'center',padding:30,color:C.gray}}>{filter==='vivo'?'No hay partidos en vivo ahora':'No hay partidos en esta categoria'}</div>}
      {!loading&&filtered.map(function(m){
        var sl=statusLabel(m),sc=getScore(m),isLive=m.status==='IN_PLAY'||m.status==='PAUSED',isFinished=m.status==='FINISHED',md=new Date(m.utcDate)
        return(<div key={m.id} style={{...sCard,border:isLive?'2px solid '+C.red:'1px solid '+C.border}}>
          {isLive&&<div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'2px',fontWeight:600,letterSpacing:1}}>EN VIVO</div>}
          <div style={{padding:'10px 12px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontSize:11,color:sl.color,fontWeight:600}}>{sl.text}</span>
              <span style={{fontSize:11,color:C.gray}}>{m.stage}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{flex:1,textAlign:'right'}}>
                <div style={{fontSize:14,fontWeight:isFinished||isLive?700:400}}>{m.homeTeam.name}</div>
                {m.homeTeam.crest&&<img src={m.homeTeam.crest} alt="" style={{width:28,height:28,objectFit:'contain',marginTop:4}}/>}
              </div>
              <div style={{minWidth:70,textAlign:'center'}}>
                {sc?<div style={{fontSize:24,fontWeight:700,color:isLive?C.red:isFinished?C.blue:'#333'}}>{sc.home} - {sc.away}</div>:<div style={{fontSize:13,color:C.gray}}>{md.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})}</div>}
              </div>
              <div style={{flex:1,textAlign:'left'}}>
                <div style={{fontSize:14,fontWeight:isFinished||isLive?700:400}}>{m.awayTeam.name}</div>
                {m.awayTeam.crest&&<img src={m.awayTeam.crest} alt="" style={{width:28,height:28,objectFit:'contain',marginTop:4}}/>}
              </div>
            </div>
            {m.venue&&<div style={{fontSize:11,color:C.gray,textAlign:'center',marginTop:6}}>{m.venue}</div>}
          </div>
        </div>)
      })}
    </div>
  )
}
