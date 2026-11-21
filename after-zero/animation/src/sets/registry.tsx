import React from 'react';
import * as S from '../scenes';
import {SetProps} from './common';
import * as E from './exteriors';
import * as I from './interiors';
import * as O from './observatory';
import * as B from './bunker';
import * as A from './arctic';

const wrap = (C: React.FC<any>): React.FC<SetProps> => ({dur, p}) => <C dur={dur} title={p?.title ?? 'WHAT IF YOU WERE THE LAST HUMAN ON EARTH?'} />;

export const SETS: Record<string, React.FC<SetProps>> = {
  city: E.City, windowBack: E.WindowBack, street: E.Street, noahStreet: E.NoahStreet, streetWide: E.StreetWide,
  windowNight: E.WindowNight, rooftop: E.Rooftop, journey: E.Journey, campfire: E.Campfire, obsExt: E.ObsExt,
  skyRing: E.SkyRing, obsWindow: E.ObsWindow, sunriseEnding: E.SunriseEnding,
  bedroom: I.Bedroom, tableSit: I.TableSit, phone: I.Phone, stairs: I.Stairs, tv: I.TV, supermarket: I.Supermarket,
  hospital: I.Hospital, subway: I.Subway, police: I.Police, electronics: I.Electronics, radioClose: I.RadioClose,
  tally: I.Tally, map: I.MapSet,
  profile: O.Profile, aerial: O.Aerial, obsInt: O.ObsInt, monitor: O.Monitor, dataScreen: O.DataScreen,
  pinboard: O.Pinboard, screensAll: O.ScreensAll, black: O.Black, chapter: O.Chapter, endCard: O.EndCard,
  bunkerEntrance: B.BunkerEntrance, bunkerStairs: B.BunkerStairs, corridor: B.Corridor, rubble: B.Rubble, generator: B.Generator,
  storage: B.Storage, waterTank: B.WaterTank, airFilter: B.AirFilter, bunk: B.Bunk, desk: B.Desk, journal: B.Journal,
  tallyWall: B.TallyWall, watch: B.Watch, ventShaft: B.VentShaft, blastDoor: B.BlastDoor, blueprint: B.Blueprint, tunnel: B.Tunnel,
  breakthrough: B.Breakthrough, surfaceDawn: B.SurfaceDawn, rescue: B.Rescue, phoneCall: B.PhoneCall,
  planeSky: A.PlaneSky, planeInterior: A.PlaneInterior, ingrid: A.Ingrid, crash: A.Crash, wreck: A.Wreck, thermo: A.Thermo,
  cabinNight: A.CabinNight, snowWall: A.SnowWall, iceVista: A.IceVista, aurora: A.Aurora, iceCrack: A.IceCrack, iceMap: A.IceMap,
  bear: A.Bear, flare: A.Flare, iceWalk: A.IceWalk, iceRidge: A.IceRidge, station: A.Station, stationInt: A.StationInt,
  heli: A.Heli, heliInt: A.HeliInt, heliView: A.HeliView,
  clock: wrap(S.S02), hallway: wrap(S.S05), livingWalk: wrap(S.S07), trafficLight: wrap(S.S10), title: wrap(S.S13),
};
