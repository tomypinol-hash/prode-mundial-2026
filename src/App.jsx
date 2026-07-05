import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const API_TEAM_MAP = {
  'Mexico':'Mexico','South Africa':'Sudafrica','South Korea':'Corea del Sur','Czech Republic':'Chequia','Czechia':'Chequia',
  'Canada':'Canada','Bosnia & Herzegovina':'Bosnia','Qatar':'Qatar','Switzerland':'Suiza',
  'Brazil':'Brasil','Morocco':'Marruecos','Haiti':'Haiti','Scotland':'Escocia',
  'USA':'EE.UU.','Paraguay':'Paraguay','Australia':'Australia','Türkiye':'Turquia','Turkey':'Turquia',
  'Germany':'Alemania','Ecuador':'Ecuador','Ivory Coast':'Costa de Marfil',"Cote d'Ivoire":'Costa de Marfil','Curaçao':'Curazao',
  'Netherlands':'Paises Bajos','Japan':'Japon','Tunisia':'Tunez','Sweden':'Suecia',
  'Belgium':'Belgica','Iran':'Iran','Egypt':'Egipto','New Zealand':'Nueva Zelanda',
  'Spain':'Espana','Uruguay':'Uruguay','Saudi Arabia':'Arabia Saudita','Cape Verde Islands':'Cabo Verde',
  'France':'Francia','Senegal':'Senegal','Norway':'Noruega','Iraq':'Irak',
  'Argentina':'Argentina','Algeria':'Argelia','Austria':'Austria','Jordan':'Jordania',
  'Portugal':'Portugal','Colombia':'Colombia','Uzbekistan':'Uzbekistan','Congo DR':'RD Congo',
  'England':'Inglaterra','Croatia':'Croacia','Ghana':'Ghana','Panama':'Panama',
}

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
  r32:   new Date('2026-06-28T16:00:00-03:00'),
  r16:   new Date('2026-07-04T14:00:00-03:00'),
  qf:    new Date('2026-07-09T17:00:00-03:00'),
  sf:    new Date('2026-07-14T16:00:00-03:00'),
  final: new Date('2026-07-19T16:00:00-03:00'),
}

// Fechas individuales de cada partido eliminatorio
const MATCH_DATES = {
  // 16avos (Jun 28 - Jul 3)
  r32_0:  new Date('2026-06-28T16:00:00-03:00'), // Sudafrica vs Canada
  r32_1:  new Date('2026-06-29T17:30:00-03:00'), // Alemania vs Paraguay
  r32_2:  new Date('2026-06-29T22:00:00-03:00'), // Paises Bajos vs Marruecos
  r32_3:  new Date('2026-06-29T14:00:00-03:00'), // Brasil vs Japon
  r32_4:  new Date('2026-06-30T18:00:00-03:00'), // Francia vs Suecia
  r32_5:  new Date('2026-06-30T14:00:00-03:00'), // Costa de Marfil vs Noruega
  r32_6:  new Date('2026-06-30T22:00:00-03:00'), // Mexico vs Ecuador
  r32_7:  new Date('2026-07-01T13:00:00-03:00'), // Inglaterra vs RD Congo
  r32_8:  new Date('2026-07-01T21:00:00-03:00'), // EE.UU. vs Bosnia
  r32_9:  new Date('2026-07-01T17:00:00-03:00'), // Belgica vs Senegal
  r32_10: new Date('2026-07-02T21:00:00-03:00'), // Portugal vs Croacia          8pm ET
  r32_11: new Date('2026-07-02T16:00:00-03:00'), // Espana vs Austria
  r32_12: new Date('2026-07-03T01:00:00-03:00'), // Suiza vs Argelia             12am ET
  r32_13: new Date('2026-07-03T20:00:00-03:00'), // Argentina vs Cabo Verde      7pm ET
  r32_14: new Date('2026-07-03T22:30:00-03:00'), // Colombia vs Ghana
  r32_15: new Date('2026-07-03T13:00:00-03:00'), // Australia vs Egipto          12pm ET
  // Octavos (Jul 4-7)
  r16_0:  new Date('2026-07-04T18:00:00-03:00'), // Paraguay vs Francia 5pm ET
  r16_1:  new Date('2026-07-04T14:00:00-03:00'), // Canada vs Marruecos 1pm ET
  r16_2:  new Date('2026-07-06T16:00:00-03:00'), // Portugal vs Espana 3pm ET
  r16_3:  new Date('2026-07-06T21:00:00-03:00'), // EE.UU. vs Belgica 8pm ET
  r16_4:  new Date('2026-07-05T17:00:00-03:00'), // Brasil vs Noruega 4pm ET
  r16_5:  new Date('2026-07-05T21:00:00-03:00'), // Mexico vs Inglaterra 8pm ET
  r16_6:  new Date('2026-07-07T13:00:00-03:00'), // M95 12pm ET Atlanta
  r16_7:  new Date('2026-07-07T17:00:00-03:00'), // M96 4pm ET Vancouver
  // Cuartos (Jul 9-10)
  qf_0:   new Date('2026-07-09T17:00:00-03:00'), // M97 4pm ET Boston
  qf_1:   new Date('2026-07-09T22:00:00-03:00'), // M100 9pm ET Kansas City
  qf_2:   new Date('2026-07-10T16:00:00-03:00'), // M98 3pm ET Los Angeles
  qf_3:   new Date('2026-07-10T18:00:00-03:00'), // M99 5pm ET Miami
  // Semis (Jul 14-15)
  sf_0:   new Date('2026-07-14T16:00:00-03:00'), // M101 3pm ET Dallas
  sf_1:   new Date('2026-07-15T16:00:00-03:00'), // M102 3pm ET Atlanta
  // Final (Jul 19)
  final_m: new Date('2026-07-19T16:00:00-03:00'), // Final 3pm ET New York NJ
}

const LOCK_MINS = 20
const ADMIN = 'Administrador'
const ALLOWED_PLAYERS = [
  'Administrador','FedeBeltrami','Nico','Gaston','Bola',
  'Tomy ( Jugador)','Santi','Roman','EPI','Federico'
]
const WC_LEAGUE = 1
const WC_SEASON = 2026

function isMatchLocked(date){return new Date()>new Date(date.getTime()-LOCK_MINS*60000)}
function isRoundLocked(round){
  if(round==='r32'){
    // Para r32 usamos el primer partido del día como referencia del cierre
    var firstDate=new Date('2026-06-28T16:00:00-03:00')
    return new Date()>new Date(firstDate.getTime()-LOCK_MINS*60000)
  }
  return new Date()>new Date(KNOCKOUT_DATES[round].getTime()-LOCK_MINS*60000)
}
function isMatchLocked_KO(id){
  var d=MATCH_DATES[id]
  if(!d)return true
  return new Date()>new Date(d.getTime()-LOCK_MINS*60000)
}
function timeLeftKOStr(id){
  var d=MATCH_DATES[id]
  if(!d)return null
  return timeLeftStr(d)
}
function timeLeftStr(date){
  const diff=new Date(date.getTime()-LOCK_MINS*60000)-new Date()
  if(diff<=0)return null
  const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000)
  if(d>0)return d+'d '+h+'h'; if(h>0)return h+'h '+m+'m'; return m+' min'
}
function flag(code){return 'https://flagcdn.com/24x18/'+code.toLowerCase()+'.png'}
function teamObj(apiName){var n=API_TEAM_MAP[apiName]||apiName;var f=NAME_TO_FLAG[n]||'un';return{n,f}}

function emptyProde(){
  return{groups:{},scores:{},knockoutScores:{r32:{},r16:{},qf:{},sf:{},third:{},final:{}},r32:{},r16:{},qf:{},sf:{},third:{},final:{}}
}

function calcGroupTable(gName,scores){
  var g=GROUPS.find(function(x){return x.name===gName})
  if(!g)return[]
  var gMatches=GROUP_MATCHES.filter(function(m){return m.g===gName})
  var table=g.teams.map(function(t,i){return{idx:i,n:t.n,f:t.f,pts:0,gf:0,ga:0,gd:0,played:0}})
  gMatches.forEach(function(m){
    var sc=scores&&scores[m.id]
    if(!sc||sc.a===''||sc.b==='')return
    var ga=parseInt(sc.a),gb=parseInt(sc.b)
    if(isNaN(ga)||isNaN(gb))return
    var teamA=table[m.a],teamB=table[m.b]
    teamA.gf+=ga;teamA.ga+=gb;teamA.gd+=ga-gb;teamA.played++
    teamB.gf+=gb;teamB.ga+=ga;teamB.gd+=gb-ga;teamB.played++
    if(ga>gb){teamA.pts+=3}else if(ga<gb){teamB.pts+=3}else{teamA.pts+=1;teamB.pts+=1}
  })
  table.sort(function(a,b){
    if(b.pts!==a.pts)return b.pts-a.pts
    if(b.gd!==a.gd)return b.gd-a.gd
    return b.gf-a.gf
  })
  return table
}

function getClassifiedFromScores(prode,gName,pos){
  var table=calcGroupTable(gName,prode.scores)
  if(!table||table.length<pos)return null
  var t=table[pos-1]
  if(t.played===0)return null
  var g=GROUPS.find(function(x){return x.name===gName})
  return g.teams[t.idx]
}

function calcMatchPoints(pred,real){
  if(!pred||!real)return 0
  var pa=parseInt(pred.a),pb=parseInt(pred.b),ra=parseInt(real.a),rb=parseInt(real.b)
  if(isNaN(pa)||isNaN(pb)||isNaN(ra)||isNaN(rb))return 0
  if(pa===ra&&pb===rb)return 2
  var pw=pa>pb?'a':pa<pb?'b':'e',rw=ra>rb?'a':ra<rb?'b':'e'
  return pw===rw?1:0
}

function calcScore(prode,results){
  if(!prode)return 0
  var pts=0;results=results||{}
  GROUP_MATCHES.forEach(function(m){pts+=calcMatchPoints(prode.scores&&prode.scores[m.id],results[m.id])})
  // Logica eliminatorias: ganador correcto + marcador exacto son independientes y se suman
  // 16avos: 1pt ganador + 2pts exacto = 3pts max
  // Octavos: 2pts ganador + 4pts exacto = 6pts max
  // Cuartos/Semis/Final: 3pts ganador + 6pts exacto = 9pts max
  var rounds=[{k:'r32',p:1,pe:2},{k:'r16',p:2,pe:4},{k:'qf',p:3,pe:6},{k:'sf',p:3,pe:6},{k:'final',p:3,pe:6}]
  rounds.forEach(function(r){
    var rd=prode[r.k]||{},ks=prode.knockoutScores&&prode.knockoutScores[r.k]||{}
    Object.keys(rd).forEach(function(id){
      var pred=rd[id],real=results[id],realScore=results[id+'_score']
      if(!real)return
      // Punto por acertar ganador (independiente)
      if(pred&&pred.n===real.n)pts+=r.p
      // Puntos por marcador exacto (independiente)
      var predSc=ks[id]
      if(predSc&&realScore){
        var pa=parseInt(predSc.a),pb=parseInt(predSc.b),ra=parseInt(realScore.a),rb=parseInt(realScore.b)
        if(!isNaN(pa)&&!isNaN(pb)&&!isNaN(ra)&&!isNaN(rb)&&pa===ra&&pb===rb)pts+=r.pe
      }
    })
  })
  return pts
}

function getChampion(prode){return prode&&prode.final&&prode.final.final_m||null}

var C={red:'#C0392B',blue:'#1565C0',gold:'#F9A825',green:'#27ae60',border:'#e0e0e0',gray:'#888'}
function sBtn(col,ex){return Object.assign({background:col||C.blue,color:'#fff',border:'none',borderRadius:'10px',padding:'10px 16px',cursor:'pointer',fontSize:'14px',fontWeight:500,width:'100%',marginTop:'8px'},ex||{})}
function sSmallBtn(col){return{background:col||C.blue,color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:12}}
var sHeader={background:'linear-gradient(135deg,#C0392B 0%,#1565C0 60%,#F9A825 100%)',padding:'16px',textAlign:'center',borderRadius:'14px',marginBottom:'8px',color:'#fff'}
var sCard={background:'#fff',border:'1px solid '+C.border,borderRadius:'10px',overflow:'hidden',marginBottom:'8px'}
var sInput={width:'100%',padding:'10px 12px',fontSize:'16px',border:'2px solid '+C.blue,borderRadius:'10px',outline:'none',fontFamily:'inherit'}
var sLock={display:'inline-block',background:'#ffecb3',color:'#7b5800',borderRadius:'20px',padding:'2px 8px',fontSize:'11px'}
function sTab(a){return{flex:1,padding:'8px 2px',border:'none',borderRadius:'8px 8px 0 0',cursor:'pointer',fontSize:'11px',fontWeight:500,background:a?C.blue:'#eee',color:a?'#fff':'#555'}}
function sMatchTeam(w){return{display:'flex',alignItems:'center',gap:'8px',padding:'7px 10px',cursor:'pointer',fontSize:'13px',borderBottom:'1px solid '+C.border,background:w?'#e3f0fb':'#fff',borderLeft:w?'4px solid '+C.blue:'4px solid transparent',fontWeight:w?600:400}}

async function dbGetAll(){var r=await supabase.from('prodes').select('*').order('updated_at',{ascending:false});return r.error?[]:r.data}
async function dbUpsert(name,prode){var r=await supabase.from('prodes').upsert({player_name:name,prode,updated_at:new Date().toISOString()},{onConflict:'player_name'});if(r.error)console.error(r.error)}
async function dbGetOne(name){var r=await supabase.from('prodes').select('*').eq('player_name',name).single();return r.error?null:r.data}
async function dbGetResults(){var r=await supabase.from('results').select('*').eq('id','main').single();return r.error?{}:r.data?r.data.data:{}}
async function dbSaveResults(data){var r=await supabase.from('results').upsert({id:'main',data,updated_at:new Date().toISOString()},{onConflict:'id'});if(r.error)console.error(r.error)}

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

async function fetchGroupResults(){
  var data=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON+'&status=FT-AET-PEN')
  if(!data)return{}
  var results={}
  data.forEach(function(f){
    var ha=f.goals.home,hb=f.goals.away
    if(ha===null||hb===null)return
    var homeName=API_TEAM_MAP[f.teams.home.name]||f.teams.home.name
    var awayName=API_TEAM_MAP[f.teams.away.name]||f.teams.away.name
    GROUP_MATCHES.forEach(function(gm){
      var g=GROUPS.find(function(x){return x.name===gm.g})
      if(!g)return
      var ta=g.teams[gm.a].n,tb=g.teams[gm.b].n
      if(homeName===ta&&awayName===tb){results[gm.id]={a:String(ha),b:String(hb)}}
    })
  })
  return results
}

async function fetchRealStandings(){
  var data=await apiCall('standings?league='+WC_LEAGUE+'&season='+WC_SEASON)
  if(!data||!data[0])return null
  var standings=data[0].league.standings
  var classified={},thirds=[]
  standings.forEach(function(group){
    if(!group||!group[0])return
    var groupName=group[0].group
    // La API puede mandar 'Ranking of third-placed teams' o 'Group Stage' para los terceros
    var isTercerosGroup = groupName==='Ranking of third-placed teams' || groupName==='Group Stage'
    if(isTercerosGroup){
      group.slice(0,8).forEach(function(t){
        var n=API_TEAM_MAP[t.team.name]||t.team.name
        thirds.push({n,f:NAME_TO_FLAG[n]||'un',pts:t.points,gd:t.goalsDiff,gf:t.all.goals.for,rank:t.rank})
      })
      return
    }
    var letter=groupName.replace('Group ','').trim()
    if(letter.length!==1)return // ignorar cualquier otro grupo raro
    classified[letter]={}
    group.forEach(function(t){
      var n=API_TEAM_MAP[t.team.name]||t.team.name
      classified[letter][t.rank]={n,f:NAME_TO_FLAG[n]||'un',logo:t.team.logo}
    })
  })
  return{classified,thirds}
}

async function fetchKnockoutResults(round,realStandings,existingResults){
  var roundMap={r32:'Round of 32',r16:'Round of 16',qf:'Quarter-finals',sf:'Semi-finals',final:'Final'}
  var data=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON+'&round='+encodeURIComponent(roundMap[round])+'&status=FT-AET-PEN')
  if(!data)return{}
  var results={}
  // Funcion helper para obtener nombre de equipo del bracket
  function getBracketName(g,pos){
    if(!realStandings)return null
    if(g==='3rd')return realStandings.thirds&&realStandings.thirds[pos]?realStandings.thirds[pos].n:null
    return realStandings.classified&&realStandings.classified[g]&&realStandings.classified[g][pos]?realStandings.classified[g][pos].n:null
  }
  data.forEach(function(f){
    var ha=f.goals.home,hb=f.goals.away
    if(ha===null||hb===null)return
    var homeName=API_TEAM_MAP[f.teams.home.name]||f.teams.home.name
    var awayName=API_TEAM_MAP[f.teams.away.name]||f.teams.away.name
    var winnerName=f.teams.home.winner?homeName:awayName
    // Buscar el id correcto en el bracket por nombre de equipos
    var matchId=null
    if(round==='r32'&&realStandings){
      for(var idx2=0;idx2<ROUND_32_PAIRS.length;idx2++){
        var pair2=ROUND_32_PAIRS[idx2]
        var n1=getBracketName(pair2[0],pair2[1])
        var n2=getBracketName(pair2[2],pair2[3])
        if(n1&&n2&&((n1===homeName&&n2===awayName)||(n1===awayName&&n2===homeName))){
          matchId=round+'_'+idx2
          break
        }
      }
    } else if(round==='final'){
      matchId='final_m'
    } else {
      // Para r16, qf, sf: buscar por nombres de equipo en los resultados existentes de la ronda anterior
      // Los equipos que juegan son los ganadores de la ronda anterior
      var prevRound={r16:'r32',qf:'r16',sf:'qf'}[round]
      var counts={r16:8,qf:4,sf:2}
      var total=counts[round]||0
      if(prevRound){
        var pairsMap={r16:R16_PAIRS}
        var roundPairs=pairsMap[round]
        for(var idx3=0;idx3<total;idx3++){
          var pid=round+'_'+idx3
          var prevKeyA=roundPairs?roundPairs[idx3][0]:prevRound+'_'+(idx3*2)
          var prevKeyB=roundPairs?roundPairs[idx3][1]:prevRound+'_'+(idx3*2+1)
          var prevA=existingResults&&existingResults[prevKeyA]
          var prevB=existingResults&&existingResults[prevKeyB]
          var nameA=prevA?prevA.n:null
          var nameB=prevB?prevB.n:null
          if(nameA&&nameB&&((nameA===homeName&&nameB===awayName)||(nameA===awayName&&nameB===homeName))){
            matchId=pid
            break
          }
        }
      }
      // Fallback: usar índice del array
      if(!matchId){
        var dataIdx=data.indexOf(f)
        if(dataIdx>=0&&dataIdx<total)matchId=round+'_'+dataIdx
      }
    }
    if(!matchId)return
    results[matchId]=teamObj(winnerName)
    results[matchId+'_score']={a:String(ha),b:String(hb)}
    var penHome=f.score&&f.score.penalty&&f.score.penalty.home
    var penAway=f.score&&f.score.penalty&&f.score.penalty.away
    if(penHome!==null&&penHome!==undefined&&penAway!==null&&penAway!==undefined){
      results[matchId+'_penalty']={a:String(penHome),b:String(penAway)}
    }
  })
  return results
}

var R16_PAIRS=[
  ['r32_1','r32_4'],   // r16_0: Paraguay vs Francia
  ['r32_0','r32_2'],   // r16_1: Canada vs Marruecos
  ['r32_10','r32_11'], // r16_2: Portugal vs Espana
  ['r32_8','r32_9'],   // r16_3: EE.UU. vs Belgica
  ['r32_3','r32_5'],   // r16_4: Brasil vs Noruega
  ['r32_6','r32_7'],   // r16_5: Mexico vs Inglaterra
  ['r32_13','r32_15'], // r16_6: Argentina vs Egipto
  ['r32_12','r32_14'], // r16_7: Suiza vs Colombia
]
var ROUND_32_PAIRS=[
  ['A',2,'B',2],      // r32_0: Sudafrica vs Canada
  ['E',1,'3rd',6],    // r32_1: Alemania vs Paraguay
  ['F',1,'C',2],      // r32_2: Paises Bajos vs Marruecos
  ['C',1,'F',2],      // r32_3: Brasil vs Japon
  ['I',1,'3rd',1],    // r32_4: Francia vs Suecia
  ['E',2,'I',2],      // r32_5: Costa de Marfil vs Noruega
  ['A',1,'3rd',3],    // r32_6: Mexico vs Ecuador
  ['L',1,'3rd',0],    // r32_7: Inglaterra vs RD Congo
  ['D',1,'3rd',4],    // r32_8: EE.UU. vs Bosnia
  ['G',1,'3rd',7],    // r32_9: Belgica vs Senegal
  ['K',2,'L',2],      // r32_10: Portugal vs Croacia
  ['H',1,'J',2],      // r32_11: Espana vs Austria
  ['B',1,'3rd',5],    // r32_12: Suiza vs Argelia
  ['J',1,'H',2],      // r32_13: Argentina vs Cabo Verde
  ['K',1,'3rd',2],    // r32_14: Colombia vs Ghana
  ['D',2,'G',2],      // r32_15: Australia vs Egipto
]
var ROUND_COUNTS={r32:16,r16:8,qf:4,sf:2}
var ROUND_LABELS={r32:'Partido',r16:'Octavo',qf:'Cuarto',sf:'Semifinal'}
// Orden cronológico de Octavos y etiquetas día/hora (hora ARG)
var R16_ORDER=[1,0,4,5,2,3,6,7]
var MATCH_DATETIME={
  r16_0:'Sáb 4/7 18:00',r16_1:'Sáb 4/7 14:00',
  r16_2:'Lun 6/7 16:00',r16_3:'Lun 6/7 21:00',
  r16_4:'Dom 5/7 17:00',r16_5:'Dom 5/7 21:00',
  r16_6:'Mar 7/7 13:00',r16_7:'Mar 7/7 17:00',
  qf_0:'Mié 9/7 17:00',qf_1:'Mié 9/7 22:00',
  qf_2:'Jue 10/7 16:00',qf_3:'Jue 10/7 18:00',
  sf_0:'Lun 14/7 16:00',sf_1:'Mar 15/7 16:00',
  final_m:'Sáb 19/7 16:00',
}

function getTeamsForMatch(round,idx,prode,realStandings,results){
  function getClassified(g,pos){
    if(realStandings&&realStandings.classified&&realStandings.classified[g]&&realStandings.classified[g][pos])
      return realStandings.classified[g][pos]
    var fromScores=getClassifiedFromScores(prode,g,pos)
    if(fromScores)return fromScores
    return null
  }
  function get3rd(idx){
    if(realStandings&&realStandings.thirds&&realStandings.thirds[idx])return realStandings.thirds[idx]
    return null
  }
  if(round==='r32'){
    var pair=ROUND_32_PAIRS[idx]
    if(!pair)return[null,null]
    var t1=pair[0]==='3rd'?get3rd(pair[1]):getClassified(pair[0],pair[1])
    var t2=pair[2]==='3rd'?get3rd(pair[3]):getClassified(pair[2],pair[3])
    return[t1,t2]
  }
  // Para r16: usar cruces reales del bracket FIFA
  if(round==='r16'){
    var r16pair=R16_PAIRS[idx]
    if(!r16pair)return[null,null]
    var prevA=results&&results[r16pair[0]]||prode.r32[r16pair[0]]||null
    var prevB=results&&results[r16pair[1]]||prode.r32[r16pair[1]]||null
    return[prevA,prevB]
  }
  if(round==='qf'){
    var prevA=results&&results['r16_'+(idx*2)]||prode.r16['r16_'+(idx*2)]||null
    var prevB=results&&results['r16_'+(idx*2+1)]||prode.r16['r16_'+(idx*2+1)]||null
    return[prevA,prevB]
  }
  if(round==='sf'){
    var prevA=results&&results['qf_'+(idx*2)]||prode.qf['qf_'+(idx*2)]||null
    var prevB=results&&results['qf_'+(idx*2+1)]||prode.qf['qf_'+(idx*2+1)]||null
    return[prevA,prevB]
  }
  return[null,null]
}

// ---- PARTIDOS DE HOY ----
function TodayMatches(props){
  var prode=props.prode,results=props.results,readonly=props.readonly,setProde=props.setProde
  var [liveScores,setLiveScores]=useState({})
  var now=new Date()
  var todayStr=now.toDateString()
  var todayMatches=GROUP_MATCHES.filter(function(m){
    return new Date(m.date).toDateString()===todayStr
  })

  useEffect(function(){
    async function fetchLive(){
      // Pedimos partidos en vivo (LIVE) y también los finalizados de hoy por separado
      var liveData=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON+'&status=1H-2H-HT-ET')
      var live={}
      if(liveData){
        liveData.forEach(function(f){
          var s=f.fixture.status.short
          var ha=f.goals.home,hb=f.goals.away
          if(ha===null||hb===null)return
          var homeName=API_TEAM_MAP[f.teams.home.name]||f.teams.home.name
          var awayName=API_TEAM_MAP[f.teams.away.name]||f.teams.away.name
          GROUP_MATCHES.forEach(function(gm){
            var g=GROUPS.find(function(x){return x.name===gm.g})
            if(!g)return
            var ta=g.teams[gm.a].n,tb=g.teams[gm.b].n
            if(homeName===ta&&awayName===tb){
              live[gm.id]={a:String(ha),b:String(hb),status:s,elapsed:f.fixture.status.elapsed,isLive:true,isFinished:false}
            }
          })
        })
      }
      setLiveScores(live)
    }
    fetchLive()
    var t=setInterval(fetchLive,60000)
    return function(){clearInterval(t)}
  },[])

  if(todayMatches.length===0)return null
  var dateLabel=now.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})
  dateLabel=dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1)
  function setScore(matchId,side,val,matchDate){
    if(readonly||isMatchLocked(matchDate))return
    var newS=Object.assign({},prode.scores),cur=newS[matchId]||{a:'',b:''}
    newS[matchId]=Object.assign({},cur,{[side]:val});setProde(Object.assign({},prode,{scores:newS}))
  }
  return(
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,fontWeight:600,color:C.gray,marginBottom:8,letterSpacing:.5,textTransform:'uppercase'}}>Partidos de hoy — {dateLabel}</div>
      {todayMatches.map(function(m){
        var g=GROUPS.find(function(x){return x.name===m.g})
        var ta=g.teams[m.a],tb=g.teams[m.b]
        var locked=isMatchLocked(m.date)
        var tl=timeLeftStr(m.date)
        var sc=prode.scores&&prode.scores[m.id]
        // usar liveScores si existe, sino results (FT guardado en DB)
        var liveSc=liveScores[m.id]
        var realSc=liveSc||results&&results[m.id]
        var isLive=liveSc&&liveSc.isLive
        var isFinished=liveSc?liveSc.isFinished:(realSc&&locked)
        var pts=sc&&realSc?calcMatchPoints(sc,realSc):null
        var bg=isFinished?(pts===2?'#eafff0':pts===1?'#fff8e1':pts===0?'#ffeaea':'#fafafa'):isLive?'#fff8f8':'#fff'
        var borderCol=isLive?C.red:isFinished?(pts===2?C.green:pts===1?C.gold:pts===0?C.red:C.border):locked?C.border:C.blue
        return(
          <div key={m.id} style={{background:bg,border:'1.5px solid '+borderCol,borderRadius:10,padding:'10px 12px',marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:11,color:C.gray}}>Grupo {m.g} · {new Date(m.date).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} hs</span>
              {isLive?(
                <span style={{fontSize:11,fontWeight:600,color:C.red}}>⚽ EN VIVO {liveSc.elapsed?liveSc.elapsed+"'":''}</span>
              ):isFinished?(
                <span style={{fontSize:11,fontWeight:600,color:pts===2?C.green:pts===1?C.gold:pts===0?C.red:C.gray}}>
                  {pts===2?'✅ +2pts exacto':pts===1?'👍 +1pt ganador':pts===0?'❌ 0pts':'Finalizado'}
                </span>
              ):locked?(
                <span style={sLock}>Cerrado</span>
              ):(
                tl&&<span style={{fontSize:11,color:C.gold,fontWeight:500}}>{tl} para el cierre</span>
              )}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{flex:1,display:'flex',alignItems:'center',gap:6}}>
                <img src={flag(ta.f)} alt={ta.n} style={{width:22,height:15,objectFit:'cover'}}/>
                <span style={{fontSize:13,fontWeight:500}}>{ta.n}</span>
              </div>
              {realSc?(
                <div style={{textAlign:'center',minWidth:70}}>
                  <div style={{fontSize:22,fontWeight:700,color:isLive?C.red:C.blue}}>{realSc.a} - {realSc.b}</div>
                  <div style={{fontSize:10,color:C.gray}}>{isLive?'en curso':'resultado real'}</div>
                </div>
              ):(
                <div style={{fontSize:13,color:C.gray,minWidth:30,textAlign:'center'}}>vs</div>
              )}
              <div style={{flex:1,display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end'}}>
                <span style={{fontSize:13,fontWeight:500}}>{tb.n}</span>
                <img src={flag(tb.f)} alt={tb.n} style={{width:22,height:15,objectFit:'cover'}}/>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:8,paddingTop:8,borderTop:'1px solid '+C.border}}>
              <span style={{fontSize:11,color:C.gray,flexShrink:0}}>Tu pronóstico:</span>
              <div style={{flex:1,display:'flex',alignItems:'center',gap:6,justifyContent:'center'}}>
                <img src={flag(ta.f)} alt="" style={{width:16,height:11}}/>
                <input type="number" min="0" max="20" value={sc?sc.a:''} onChange={function(e){setScore(m.id,'a',e.target.value,m.date)}} disabled={locked||readonly} style={{width:34,padding:'3px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:13,fontWeight:600}} placeholder="-"/>
                <span style={{color:C.gray}}>-</span>
                <input type="number" min="0" max="20" value={sc?sc.b:''} onChange={function(e){setScore(m.id,'b',e.target.value,m.date)}} disabled={locked||readonly} style={{width:34,padding:'3px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:13,fontWeight:600}} placeholder="-"/>
                <img src={flag(tb.f)} alt="" style={{width:16,height:11}}/>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getActiveTab(){
  var now=new Date()
  // Último partido de grupos: 28 jun 02:00 UTC = 27 jun 23:00 ARG
  var lastGroup=new Date('2026-06-28T02:00:00Z')
  if(now<new Date(lastGroup.getTime()+2*3600000))return 'groups'
  var rounds=['r32','r16','qf','sf','final']
  for(var i=0;i<rounds.length;i++){
    var rd=rounds[i]
    var rdDate=new Date(KNOCKOUT_DATES[rd].getTime()+3*24*3600000)
    if(now<rdDate)return rd
  }
  return 'final'
}

export default function App(){
  var [screen,setScreen]=useState('home')
  var [currentPlayer,setPlayer]=useState(null)
  var [prode,setProdeState]=useState(emptyProde())
  var [nameInput,setNameInput]=useState('')
  var [passInput,setPassInput]=useState('')
  var [players,setPlayers]=useState([])
  var [results,setResults]=useState({})
  var [realStandings,setRealStandings]=useState(null)
  var [loading,setLoading]=useState(false)
  var [saving,setSaving]=useState(false)
  var [activeTab,setActiveTab]=useState(getActiveTab())
  var [error,setError]=useState('')

  useEffect(function(){
    fetchAll()
    // Sync al abrir: si algun partido termino en las ultimas 2 horas o esta en curso
    var MATCH_MINS=115 // 90min partido + 25min descuento/extra
    var now=new Date()
    var needsSync=GROUP_MATCHES.some(function(m){
      var end=new Date(m.date.getTime()+MATCH_MINS*60000)
      var sinceStart=(now-m.date)/60000   // minutos desde que arranco
      var sinceEnd=(now-end)/60000        // minutos desde que termino (estimado)
      var enCurso=sinceStart>=0&&sinceEnd<=0    // partido en curso
      var recienTermino=sinceEnd>=0&&sinceEnd<=120  // termino hace menos de 2 horas
      return enCurso||recienTermino
    })
    if(needsSync)syncAll()
    // Cada 5 min, sync si hay partido activo o termino hace menos de 2 horas
    var t=setInterval(function(){
      var n=new Date()
      var active=GROUP_MATCHES.some(function(m){
        var end=new Date(m.date.getTime()+MATCH_MINS*60000)
        var sinceStart=(n-m.date)/60000
        var sinceEnd=(n-end)/60000
        return(sinceStart>=0&&sinceEnd<=0)||(sinceEnd>=0&&sinceEnd<=120)
      })
      if(active)syncAll()
    },5*60*1000)
    return function(){clearInterval(t)}
  },[])

  async function fetchAll(){
    setLoading(true)
    var rows=await dbGetAll(),res=await dbGetResults()
    if(!res||typeof res!=='object'){setLoading(false);return}
    setPlayers(rows);setResults(res)
    setRealStandings(res.real_standings||null)
    setLoading(false)
  }

  async function syncAll(){
    var groupRes=await fetchGroupResults()
    var standings=await fetchRealStandings()
    var koResults={}
    var cur2=await dbGetResults()
    var rounds=['r32','r16','qf','sf','final']
    for(var i=0;i<rounds.length;i++){
      var kr=await fetchKnockoutResults(rounds[i],standings,Object.assign({},cur2,koResults))
      Object.assign(koResults,kr)
    }
    var cur=await dbGetResults()
    var cleanKo={}
    Object.keys(koResults).forEach(function(k){if(koResults[k]!==null&&koResults[k]!==undefined)cleanKo[k]=koResults[k]})
    var merged=Object.assign({},cur,groupRes,cleanKo)
    if(standings){merged.real_standings=standings;setRealStandings(standings)}
    await dbSaveResults(merged)
    setResults(merged)
  }

  async function handleJoin(){
    var name=nameInput.trim(),pass=passInput.trim()
    if(!name){setError('Escribi tu nombre');return}
    if(!pass){setError('Escribi una contrasena');return}
    if(!ALLOWED_PLAYERS.includes(name)){
      setError('Este nombre no está en la lista. Escribilo exactamente como te lo dieron o contactá a Tomy.')
      return
    }
    setError('');setLoading(true)
    var row=await dbGetOne(name)
    if(!row){var np=emptyProde();np._pass=pass;await dbUpsert(name,np);row=await dbGetOne(name)}
    else if(row.prode._pass!==pass){setError('Contrasena incorrecta');setLoading(false);return}
    setPlayer(name);setProdeState(row.prode);await fetchAll()
    setScreen(name===ADMIN?'admin':'prode');setNameInput('');setPassInput('');setActiveTab(getActiveTab());setLoading(false)
  }

  async function saveProde(newProde){setProdeState(newProde);setSaving(true);await dbUpsert(currentPlayer,newProde);setSaving(false)}
  async function saveResults(newResults){await dbSaveResults(newResults);setResults(newResults);if(newResults.real_standings)setRealStandings(newResults.real_standings)}

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
        <TodayMatches prode={prode} results={results} readonly={true}/>
        <ProdeView prode={prode} results={results} realStandings={realStandings} readonly={true} isOwn={false} activeTab={activeTab} setActiveTab={setActiveTab}/>
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
        <TodayMatches prode={prode} results={results} readonly={false} setProde={saveProde}/>
        <ProdeView prode={prode} results={results} realStandings={realStandings} readonly={false} isOwn={true} setProde={saveProde} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <div style={{textAlign:'center',marginTop:10,padding:'10px',background:'#f9f9f9',borderRadius:10}}>
          <div style={{fontSize:13,color:C.gray}}>Tu puntaje</div>
          <div style={{fontSize:28,fontWeight:700,color:C.blue}}>{calcScore(prode,results)} pts</div>
        </div>
      </div>
    )
  }

  var sorted=[...players].sort(function(a,b){return calcScore(b.prode,results)-calcScore(a.prode,results)})
  return(
    <div style={{maxWidth:480,margin:'0 auto',padding:'12px 8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:38,marginBottom:4}}>🏆</div>
        <div style={{fontSize:22,fontWeight:600}}>PRODE MUNDIAL 2026</div>
        <div style={{fontSize:13,opacity:.9,marginTop:4}}>USA - Mexico - Canada</div>
        <button onClick={function(){setScreen('live')}} style={{background:'rgba(255,255,255,.25)',color:'#fff',border:'2px solid rgba(255,255,255,.6)',borderRadius:10,padding:'6px 20px',cursor:'pointer',fontSize:13,fontWeight:600,marginTop:10}}>Ver partidos en vivo</button>
      </div>
      <div style={{background:'linear-gradient(135deg,#74acdf 0%,#ffffff 50%,#74acdf 100%)',borderRadius:12,padding:'10px 16px',marginTop:8,display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
        <span style={{fontSize:22}}>🇦🇷</span>
        <span style={{fontSize:14,fontWeight:600,color:'#1565C0',letterSpacing:1}}>¡VAMOS ARGENTINA!</span>
        <span style={{fontSize:22}}>🇦🇷</span>
      </div>
      <div style={{...sCard,padding:'20px 16px',marginTop:10}}>
        <div style={{fontSize:15,fontWeight:500,color:C.blue,marginBottom:8,textAlign:'center'}}>Entrar al prode</div>
        <div style={{fontSize:11,color:C.gray,marginBottom:12,textAlign:'center',background:'#f9f9f9',padding:'6px 10px',borderRadius:8}}>
          ⚠️ El nombre debe ser exactamente igual al registrado (mayúsculas, espacios y caracteres incluidos)<br/>
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
                <button onClick={async function(){setLoading(true);var row=await dbGetOne(p.player_name);setPlayer(p.player_name);setProdeState(row?row.prode:emptyProde());setScreen('view');setActiveTab(getActiveTab());setLoading(false)}} style={sSmallBtn(C.blue)}>Ver</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProdeView(props){
  var prode=props.prode,results=props.results,realStandings=props.realStandings
  var readonly=props.readonly,isOwn=props.isOwn,setProde=props.setProde,activeTab=props.activeTab,setActiveTab=props.setActiveTab
  var tabs=[{id:'groups',label:'Grupos'},{id:'r32',label:'16avos'},{id:'r16',label:'Octavos'},{id:'qf',label:'Cuartos'},{id:'sf',label:'Semis'},{id:'final',label:'Final'}]
  return(
    <div>
      <div style={{display:'flex',gap:2}}>{tabs.map(function(t){return <button key={t.id} style={sTab(activeTab===t.id)} onClick={function(){setActiveTab(t.id)}}>{t.label}</button>})}</div>
      <div style={{background:'#fff',border:'1px solid '+C.border,borderRadius:'0 0 10px 10px',padding:'10px 8px'}}>
        {activeTab==='groups'&&<GroupsTab prode={prode} results={results} setProde={setProde} readonly={readonly}/>}
        {activeTab==='r32'&&<KnockoutTab round='r32' prode={prode} results={results} setProde={setProde} readonly={readonly} isOwn={isOwn} realStandings={realStandings}/>}
        {activeTab==='r16'&&<KnockoutTab round='r16' prode={prode} results={results} setProde={setProde} readonly={readonly} isOwn={isOwn} realStandings={realStandings}/>}
        {activeTab==='qf'&&<KnockoutTab round='qf' prode={prode} results={results} setProde={setProde} readonly={readonly} isOwn={isOwn} realStandings={realStandings}/>}
        {activeTab==='sf'&&<KnockoutTab round='sf' prode={prode} results={results} setProde={setProde} readonly={readonly} isOwn={isOwn} realStandings={realStandings}/>}
        {activeTab==='final'&&<FinalTab prode={prode} results={results} setProde={setProde} readonly={readonly} isOwn={isOwn} realStandings={realStandings}/>}
      </div>
    </div>
  )
}

function ResultBar(props){
  var pts=props.pts,realSc=props.realSc
  if(!realSc)return null
  var bg=pts===2?'#eafff0':pts===1?'#fff8e1':'#ffeaea'
  var txt=pts===2?'✅ +2pts exacto':pts===1?'👍 +1pt ganador':'❌ 0pts'
  var col=pts===2?C.green:pts===1?C.gold:C.red
  return(
    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4,padding:'3px 6px',background:bg,borderRadius:6,fontSize:11}}>
      <span style={{color:C.gray}}>Real:</span>
      <span style={{fontWeight:700}}>{realSc.a} - {realSc.b}</span>
      <span style={{marginLeft:'auto',fontWeight:700,color:col}}>{txt}</span>
    </div>
  )
}

function PrivadoBloqueo(props){
  var round=props.round
  var labels={r16:'Octavos',qf:'Cuartos',sf:'Semis',final:'Final'}
  return(
    <div style={{textAlign:'center',padding:'30px 20px',color:C.gray}}>
      <div style={{fontSize:32,marginBottom:12}}>🔒</div>
      <div style={{fontSize:15,fontWeight:600,color:C.blue,marginBottom:8}}>Pronósticos ocultos</div>
      <div style={{fontSize:13}}>Los pronósticos de {labels[round]||round} de otros jugadores<br/>se revelan cuando comienza esa fase.</div>
    </div>
  )
}

function GroupsTab(props){
  var prode=props.prode,results=props.results,setProde=props.setProde,readonly=props.readonly
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
            <div style={{background:C.blue,color:'#fff',padding:'5px 10px',fontSize:13,fontWeight:500}}>GRUPO {g.name}</div>
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
            <div style={{padding:'6px 8px'}}>
              <div style={{fontSize:11,color:C.gray,marginBottom:4}}>Pronosticá los marcadores:</div>
              {gMatches.map(function(m){
                var locked=isMatchLocked(m.date),tl=timeLeftStr(m.date),ta=g.teams[m.a],tb=g.teams[m.b]
                var sc=prode.scores&&prode.scores[m.id]
                var realSc=results&&results[m.id]
                var pts=sc&&realSc?calcMatchPoints(sc,realSc):null
                return(
                  <div key={m.id} style={{marginBottom:6,borderBottom:'1px solid #f0f0f0',paddingBottom:6}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12}}>
                      <img src={flag(ta.f)} alt={ta.n} style={{width:16,height:11,objectFit:'cover'}}/>
                      <span style={{width:70,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ta.n}</span>
                      <input type="number" min="0" max="20" value={sc?sc.a:''} onChange={function(e){setScore(m.id,'a',e.target.value,m.date)}} disabled={locked||readonly} style={{width:32,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
                      <span style={{color:C.gray}}>-</span>
                      <input type="number" min="0" max="20" value={sc?sc.b:''} onChange={function(e){setScore(m.id,'b',e.target.value,m.date)}} disabled={locked||readonly} style={{width:32,padding:'2px 4px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
                      <img src={flag(tb.f)} alt={tb.n} style={{width:16,height:11,objectFit:'cover'}}/>
                      <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tb.n}</span>
                      {locked?<span style={sLock}>Cerrado</span>:(tl&&<span style={{color:C.gold,fontSize:10}}>{tl}</span>)}
                    </div>
                    <ResultBar pts={pts} realSc={realSc}/>
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

function KnockoutTab(props){
  var round=props.round,prode=props.prode,results=props.results,setProde=props.setProde
  var readonly=props.readonly,isOwn=props.isOwn,realStandings=props.realStandings
  // Privacidad: octavos en adelante bloqueado para ver ajeno hasta que la fase cierre
  var privadoRounds=['r16','qf','sf']
  if(readonly&&!isOwn&&privadoRounds.includes(round)&&!isRoundLocked(round)){
    return <PrivadoBloqueo round={round}/>
  }
  var roundLocked=isRoundLocked(round),count=ROUND_COUNTS[round],items=[]
  function setKnockoutScore(id,side,val,ta,tb){
    if(isMatchLocked_KO(id)||readonly)return
    var ks=Object.assign({},prode.knockoutScores||{}),rs=Object.assign({},ks[round]||{})
    var cur=rs[id]||{a:'',b:''}
    var newSc=Object.assign({},cur,{[side]:val})
    rs[id]=newSc
    ks[round]=rs
    var pa=parseInt(newSc.a),pb=parseInt(newSc.b)
    var newProde=Object.assign({},prode,{knockoutScores:ks})
    if(!isNaN(pa)&&!isNaN(pb)&&ta&&tb){
      if(pa!==pb){
        // Marcador define ganador — auto-seleccionar y no permitir cambio manual
        var winner=pa>pb?ta:tb
        var nr=Object.assign({},prode[round],{[id]:winner})
        newProde=Object.assign({},newProde,{[round]:nr})
      } else {
        // Empate — limpiar ganador para que el jugador elija manualmente
        var nr2=Object.assign({},prode[round])
        delete nr2[id]
        newProde=Object.assign({},newProde,{[round]:nr2})
      }
    }
    setProde(newProde)
  }
  // Para r16, ordenar cronológicamente
  var renderOrder=[]
  if(round==='r16'){for(var ri=0;ri<R16_ORDER.length;ri++)renderOrder.push(R16_ORDER[ri])}
  else{for(var ri2=0;ri2<count;ri2++)renderOrder.push(ri2)}
  for(var i=0;i<renderOrder.length;i++){
    (function(idx){
      var id=round+'_'+idx
      var matchDateTime=MATCH_DATETIME[round==='final'?'final_m':round+'_'+idx]||null
      var teams=getTeamsForMatch(round,idx,prode,realStandings,results)
      var ta=teams[0],tb=teams[1],w=prode[round][id]||null
      var sc=(prode.knockoutScores&&prode.knockoutScores[round]&&prode.knockoutScores[round][id])||null
      var realWinner=results&&results[id]||null
      var realScore=results&&results[id+'_score']||null
      // Para r32, cada partido tiene su propio cierre
      var matchLocked=isMatchLocked_KO(id)
      var matchTl=timeLeftKOStr(id)
      items.push(<div key={id} style={Object.assign({},sCard,{marginBottom:8})}>
        <div style={{background:C.red,color:'#fff',fontSize:11,textAlign:'center',padding:'3px'}}>{ROUND_LABELS[round]} {i+1}{matchDateTime?' — '+matchDateTime:''}</div>
        {[ta,tb].map(function(t,ti){
          var isW=w&&t&&w.n===t.n
          var isRealW=realWinner&&t&&realWinner.n===t.n
          return(<div key={ti} style={Object.assign({},sMatchTeam(isW),{cursor:(matchLocked||!t||readonly)?'default':'pointer',background:isRealW?'#eafff0':isW?'#e3f0fb':'#fff'})} onClick={function(){if(t&&!matchLocked&&!readonly){
                  var sc2=prode.knockoutScores&&prode.knockoutScores[round]&&prode.knockoutScores[round][id]
                  var pa2=sc2?parseInt(sc2.a):NaN,pb2=sc2?parseInt(sc2.b):NaN
                  var marcadorDefineGanador=!isNaN(pa2)&&!isNaN(pb2)&&pa2!==pb2
                  if(marcadorDefineGanador)return
                  var nr=Object.assign({},prode[round],{[id]:t})
                  setProde(Object.assign({},prode,{[round]:nr}))
                }}}>
            {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}}/><span style={{flex:1}}>{t.n}</span>{isRealW&&<span style={{color:C.green,fontSize:11,fontWeight:700}}>✓ Real</span>}{!isRealW&&isW&&<span style={{color:C.blue,fontSize:11}}>✓ Mi prode</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
          </div>)
        })}
        {(ta&&tb)&&(
          <div style={{padding:'6px 10px',borderTop:'1px solid #f0f0f0',display:'flex',alignItems:'center',gap:6,fontSize:12}}>
            <span style={{color:C.gray,fontSize:11}}>Marcador:</span>
            <img src={flag(ta.f)} alt="" style={{width:16,height:11}}/>
            <input type="number" min="0" max="20" value={sc?sc.a:''} onChange={function(e){setKnockoutScore(id,'a',e.target.value,ta,tb)}} disabled={matchLocked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <span style={{color:C.gray}}>-</span>
            <input type="number" min="0" max="20" value={sc?sc.b:''} onChange={function(e){setKnockoutScore(id,'b',e.target.value,ta,tb)}} disabled={matchLocked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <img src={flag(tb.f)} alt="" style={{width:16,height:11}}/>
            {matchLocked?<span style={{...sLock,marginLeft:'auto'}}>Cerrado</span>:matchTl&&<span style={{color:C.gold,fontSize:10,marginLeft:'auto'}}>{matchTl}</span>}
          </div>
        )}
        {realScore&&(function(){
          var roundP={r32:{p:1,pe:2},r16:{p:2,pe:4},qf:{p:3,pe:6},sf:{p:3,pe:6},final:{p:3,pe:6}}
          var rp=roundP[round]||{p:1,pe:2}
          var acertoGanador=w&&realWinner&&w.n===realWinner.n
          var acertoExacto=false
          if(sc&&realScore){
            var pa=parseInt(sc.a),pb=parseInt(sc.b),ra=parseInt(realScore.a),rb=parseInt(realScore.b)
            if(!isNaN(pa)&&!isNaN(pb)&&!isNaN(ra)&&!isNaN(rb)&&pa===ra&&pb===rb)acertoExacto=true
          }
          var ptsGanador=acertoGanador?rp.p:0
          var ptsExacto=acertoExacto?rp.pe:0
          var total=ptsGanador+ptsExacto
          var bg=total===(rp.p+rp.pe)?'#eafff0':total>0?'#fff8e1':'#ffeaea'
          var col=total===(rp.p+rp.pe)?C.green:total>0?C.gold:C.red
          var partes=[]
          if(acertoGanador)partes.push('+'+rp.p+'pt ganador')
          if(acertoExacto)partes.push('+'+rp.pe+'pts exacto')
          var txt=total>0?'✅ '+partes.join(' '):realWinner?'❌ 0pts':''
          if(!txt)return null
          var penScore=results&&results[id+'_penalty']
          return(<div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:bg,borderRadius:6,fontSize:11,margin:'0 6px 6px 6px'}}>
            <span style={{color:C.gray}}>Real:</span>
            <span style={{fontWeight:700}}>{realScore.a} - {realScore.b}</span>
            {penScore&&<span style={{color:C.gray}}>⚡ pen: {penScore.a}-{penScore.b}</span>}
            <span style={{marginLeft:'auto',fontWeight:700,color:col}}>{txt}</span>
          </div>)
        })()}
      </div>)
    })(renderOrder[i])
  }
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        {roundLocked?<span style={sLock}>Fase cerrada</span>:<span/>}
        {realStandings?<span style={{fontSize:11,color:C.green}}>✅ Bracket con datos reales</span>:<span style={{fontSize:11,color:C.gold}}>⏳ Usando pronósticos</span>}
      </div>
      {items}
    </div>
  )
}

function FinalTab(props){
  var prode=props.prode,results=props.results,setProde=props.setProde,readonly=props.readonly,isOwn=props.isOwn
  // Privacidad final
  if(readonly&&!isOwn&&!isRoundLocked('final')){
    return <PrivadoBloqueo round='final'/>
  }
  var locked=isMatchLocked_KO('final_m'),tl=timeLeftKOStr('final_m')
  var sf0w=(prode.sf&&prode.sf.sf_0)||null,sf1w=(prode.sf&&prode.sf.sf_1)||null
  var qf0=(prode.qf&&prode.qf.qf_0)||null,qf1=(prode.qf&&prode.qf.qf_1)||null
  var qf2=(prode.qf&&prode.qf.qf_2)||null,qf3=(prode.qf&&prode.qf.qf_3)||null
  var loser0=sf0w?(sf0w.n===(qf0&&qf0.n)?qf1:qf0):null
  var loser1=sf1w?(sf1w.n===(qf2&&qf2.n)?qf3:qf2):null
  var champ=(prode.final&&prode.final.final_m)||null
  var finalSc=(prode.knockoutScores&&prode.knockoutScores.final&&prode.knockoutScores.final.final_m)||null
  var realFinalWinner=results&&results['final_0']||null
  var realFinalScore=results&&results['final_0_score']||null
  var finalPts=null
  if(champ&&realFinalWinner){
    if(champ.n===realFinalWinner.n){
      var exactoFinal=false
      if(finalSc&&realFinalScore){
        var pfa=parseInt(finalSc.a),pfb=parseInt(finalSc.b),rfa=parseInt(realFinalScore.a),rfb=parseInt(realFinalScore.b)
        if(!isNaN(pfa)&&!isNaN(pfb)&&!isNaN(rfa)&&!isNaN(rfb)&&pfa===rfa&&pfb===rfb)exactoFinal=true
      }
      finalPts=exactoFinal?6:3
    } else {finalPts=0}
  }
  function pick(matchId,team,field){if(locked||readonly)return;setProde(Object.assign({},prode,{[field]:Object.assign({},prode[field],{[matchId]:team})}))}
  function setKScore(side,val,t1,t2){
    if(locked||readonly)return
    var ks=Object.assign({},prode.knockoutScores||{}),fn=Object.assign({},ks.final||{})
    var cur=fn.final_m||{a:'',b:''}
    var newSc=Object.assign({},cur,{[side]:val})
    fn.final_m=newSc
    ks.final=fn
    var pa=parseInt(newSc.a),pb=parseInt(newSc.b)
    var newProde=Object.assign({},prode,{knockoutScores:ks})
    if(!isNaN(pa)&&!isNaN(pb)&&pa!==pb&&t1&&t2){
      var winner=pa>pb?t1:t2
      newProde=Object.assign({},newProde,{final:Object.assign({},prode.final,{final_m:winner})})
    }
    setProde(newProde)
  }
  function MRow(t,id,field,w){
    var isW=w&&t&&w.n===t.n
    var isRealW=realFinalWinner&&t&&realFinalWinner.n===t.n
    return(<div style={Object.assign({},sMatchTeam(isW),{cursor:(locked||!t||readonly)?'default':'pointer',background:isRealW?'#eafff0':isW?'#e3f0fb':'#fff'})} onClick={function(){if(t&&!locked&&!readonly)pick(id,t,field)}}>
      {t?<><img src={flag(t.f)} alt={t.n} style={{width:20,height:14,objectFit:'cover'}}/><span style={{flex:1}}>{t.n}</span>{isRealW&&<span style={{color:C.green,fontSize:11,fontWeight:700}}>✓ Real</span>}{!isRealW&&isW&&<span style={{color:C.blue,fontSize:11}}>✓ Mi prode</span>}</>:<span style={{color:'#aaa',fontSize:12,fontStyle:'italic'}}>Por definir</span>}
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
            <input type="number" min="0" max="20" value={finalSc?finalSc.a:''} onChange={function(e){setKScore('a',e.target.value,sf0w,sf1w)}} disabled={locked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <span style={{color:C.gray}}>-</span>
            <input type="number" min="0" max="20" value={finalSc?finalSc.b:''} onChange={function(e){setKScore('b',e.target.value,sf0w,sf1w)}} disabled={locked||readonly} style={{width:32,padding:'2px',textAlign:'center',border:'1px solid '+C.border,borderRadius:4,fontSize:12}} placeholder="-"/>
            <img src={flag((sf1w||{f:'fr'}).f)} alt="" style={{width:16,height:11}}/>
            {locked&&<span style={{...sLock,marginLeft:'auto'}}>Cerrado</span>}
          </div>
        )}
        {realFinalScore&&(
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:finalPts===6?'#eafff0':finalPts===3?'#fff8e1':'#ffeaea',borderRadius:6,fontSize:11,margin:'0 6px 6px 6px'}}>
            <span style={{color:C.gray}}>Real:</span>
            <span style={{fontWeight:700}}>{realFinalScore.a} - {realFinalScore.b}</span>
            {finalPts!==null&&<span style={{marginLeft:'auto',fontWeight:700,color:finalPts===6?C.green:finalPts===3?C.gold:C.red}}>
              {finalPts===6?'✅ +6pts exacto':finalPts===3?'👍 +3pts campeon':'❌ 0pts'}
            </span>}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminPanel(props){
  var players=props.players,results=props.results,saveResults=props.saveResults
  var setScreen=props.setScreen,fetchAll=props.fetchAll,syncAll=props.syncAll
  var [localResults,setLocalResults]=useState(results||{})
  var [activeTab,setActiveTab]=useState('ranking')
  var prevResultsRef=useRef(null)
  useEffect(function(){
    if(results&&results!==prevResultsRef.current){
      prevResultsRef.current=results
      setLocalResults(Object.assign({},results))
    }
  },[results])
  var [saving,setSaving]=useState(false)
  var sorted=[...players].sort(function(a,b){return calcScore(b.prode,results)-calcScore(a.prode,results)})
  async function handleSave(){setSaving(true);await saveResults(localResults);setSaving(false)}
  async function handleSync(){setSaving(true);await syncAll();alert('Sincronizado!');setSaving(false)}
  function setResult(matchId,side,val){var key=matchId+'_score';var cur=localResults[key]||{a:'',b:''};setLocalResults(Object.assign({},localResults,{[key]:Object.assign({},cur,{[side]:val})}))}
  return(
    <div style={{maxWidth:600,margin:'0 auto',padding:'8px'}}>
      <div style={sHeader}>
        <div style={{fontSize:18,fontWeight:600}}>Panel Admin - Tomy</div>
        {(function(){
          var fase=getActiveTab()
          var faseLabel={groups:'Fase de Grupos',r32:'16avos de Final',r16:'Octavos de Final',qf:'Cuartos de Final',sf:'Semifinales',final:'Final'}
          return(<div style={{fontSize:13,fontWeight:500,background:'rgba(255,255,255,.15)',borderRadius:8,padding:'4px 12px',marginTop:6,display:'inline-block'}}>
            ⚽ Fase actual: {faseLabel[fase]||fase}
          </div>)
        })()}
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
            <div style={{fontSize:12,color:C.gray,marginBottom:8}}>Se sincronizan automáticamente cada 5 minutos.</div>
            <button onClick={handleSync} style={sBtn(C.green,{marginBottom:12})} disabled={saving}>{saving?'Sincronizando...':'Sincronizar todo ahora'}</button>
            {results.real_standings&&(
              <div style={{background:'#eafff0',border:'1px solid '+C.green,borderRadius:8,padding:'10px',marginBottom:12,fontSize:12}}>
                <div style={{fontWeight:600,color:C.green,marginBottom:6}}>✅ Standings reales cargados</div>
                {Object.keys(results.real_standings.classified||{}).sort().map(function(g){
                  var c=results.real_standings.classified[g]
                  return(<div key={g} style={{marginBottom:2}}><span style={{fontWeight:500}}>Grupo {g}:</span> {c[1]&&c[1].n} (1ro) · {c[2]&&c[2].n} (2do)</div>)
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

            {/* FASES ELIMINATORIAS */}
            <div style={{marginTop:16,borderTop:'2px solid '+C.border,paddingTop:12}}>
              <div style={{fontSize:13,fontWeight:500,color:C.blue,marginBottom:10}}>Fases eliminatorias — carga manual</div>

              {/* Terceros clasificados */}
              {results.real_standings&&results.real_standings.thirds&&results.real_standings.thirds.length>0&&(
                <div style={{background:'#f0f8ff',border:'1px solid '+C.blue,borderRadius:8,padding:'8px 10px',marginBottom:10,fontSize:12}}>
                  <div style={{fontWeight:600,color:C.blue,marginBottom:4}}>Terceros clasificados ({results.real_standings.thirds.length}/8)</div>
                  {results.real_standings.thirds.map(function(t,i){
                    return(<div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'2px 0'}}>
                      <span style={{minWidth:16,color:C.gray}}>{i+1}.</span>
                      <img src={flag(t.f)} alt={t.n} style={{width:16,height:11}}/>
                      <span>{t.n}</span>
                      <span style={{color:C.gray,fontSize:10}}>{t.pts}pts {t.gd>0?'+':''}{t.gd}dg</span>
                    </div>)
                  })}
                </div>
              )}

              {/* Carga manual por fase */}
              {['r32','r16','qf','sf','final'].map(function(round){
                var labels={r32:'16avos',r16:'Octavos',qf:'Cuartos',sf:'Semis',final:'Final'}
                var counts={r32:16,r16:8,qf:4,sf:2,final:1}
                var count=counts[round]
                var classified=localResults.real_standings&&localResults.real_standings.classified
                var thirds=localResults.real_standings&&localResults.real_standings.thirds
                function getTeam(g,pos){
                  if(!classified)return null
                  if(g==='3rd')return thirds&&thirds[pos]
                  return classified[g]&&classified[g][pos]
                }
                var pairs=round==='r32'?ROUND_32_PAIRS:round==='r16'?R16_PAIRS:null
                return(<div key={round} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.blue,marginBottom:6,borderBottom:'1px solid '+C.border,paddingBottom:2}}>{labels[round]}</div>
                  {Array.from({length:count},function(_,idx){
                    var id=round==='final'?'final_m':round+'_'+idx
                    var r=localResults[id]||{}
                    var sc=localResults[id+'_score']||{a:'',b:''}
                    var pen=localResults[id+'_penalty']||null
                    var t1=null,t2=null
                    if(round==='r32'&&pairs&&classified){t1=getTeam(pairs[idx][0],pairs[idx][1]);t2=getTeam(pairs[idx][2],pairs[idx][3])}
                    else if(round==='r16'&&pairs){t1=localResults[pairs[idx][0]]||null;t2=localResults[pairs[idx][1]]||null}
                    else{t1=localResults[round==='qf'?'r16_'+(idx*2):round==='sf'?'qf_'+(idx*2):'sf_0']||null;t2=localResults[round==='qf'?'r16_'+(idx*2+1):round==='sf'?'qf_'+(idx*2+1):'sf_1']||null}
                    var n1=t1?t1.n:'Equipo 1'
                    var n2=t2?t2.n:'Equipo 2'
                    return(<div key={id} style={{padding:'4px 0',borderBottom:'1px solid #f5f5f5'}}>
                      <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,marginBottom:3}}>
                        {t1&&<img src={flag(t1.f)} alt="" style={{width:14,height:10}}/>}
                        <span style={{flex:1,color:C.blue,fontSize:11}}>{n1}</span>
                        <input type="number" min="0" max="20" value={sc.a} onChange={function(e){setResult(id,'a',e.target.value)}} style={{width:30,padding:'1px',textAlign:'center',border:'1px solid '+C.border,borderRadius:3,fontSize:11}} placeholder="-"/>
                        <span style={{color:C.gray}}>-</span>
                        <input type="number" min="0" max="20" value={sc.b} onChange={function(e){setResult(id,'b',e.target.value)}} style={{width:30,padding:'1px',textAlign:'center',border:'1px solid '+C.border,borderRadius:3,fontSize:11}} placeholder="-"/>
                        {t2&&<img src={flag(t2.f)} alt="" style={{width:14,height:10}}/>}
                        <span style={{flex:1,color:C.blue,fontSize:11,textAlign:'right'}}>{n2}</span>
                      </div>
                      <div style={{display:'flex',gap:4,fontSize:10}}>
                        <span style={{color:C.gray}}>Ganador:</span>
                        {[t1,t2].filter(Boolean).map(function(t,ti){
                          var isW=r&&r.n===t.n
                          return(<button key={ti} onClick={function(){
                            var winner={n:t.n,f:t.f}
                            var sc2=localResults[id+'_score']||{a:'',b:''}
                            setLocalResults(Object.assign({},localResults,{[id]:winner,[id+'_score']:sc2}))
                          }} style={{padding:'1px 6px',border:'1px solid '+(isW?C.green:C.border),borderRadius:3,background:isW?'#eafff0':'#fff',color:isW?C.green:C.gray,cursor:'pointer',fontSize:10}}>{t.n}</button>)
                        })}
                        {r&&r.n&&<span style={{color:C.green,marginLeft:4}}>✓ {r.n}</span>}
                        {pen&&<span style={{color:C.gray,marginLeft:4}}>⚡ pen: {pen.a}-{pen.b}</span>}
                      </div>
                    </div>)
                  })}
                </div>)
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

function LiveScreen(props){
  var setScreen=props.setScreen
  var [matches,setMatches]=useState(null),[loading,setLoading]=useState(true),[lastUpdate,setLastUpdate]=useState(null),[filter,setFilter]=useState('hoy')
  async function load(){
    setLoading(true)
    var data=await apiCall('fixtures?league='+WC_LEAGUE+'&season='+WC_SEASON)
    if(data){setMatches(data.map(function(f){return{id:f.fixture.id,utcDate:f.fixture.date,status:mapStatus(f.fixture.status.short),stage:f.league.round,venue:f.fixture.venue.name,homeTeam:{name:f.teams.home.name,crest:f.teams.home.logo},awayTeam:{name:f.teams.away.name,crest:f.teams.away.logo},score:{fullTime:{home:f.goals.home,away:f.goals.away},halfTime:{home:f.score.halftime.home,away:f.score.halftime.away}}}}))}
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
