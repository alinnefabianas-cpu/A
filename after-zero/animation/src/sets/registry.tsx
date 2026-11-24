import React from 'react';
import * as S from '../scenes';
import {SetProps} from './common';
import * as E from './exteriors';
import * as I from './interiors';
import * as O from './observatory';
import * as B from './bunker';
import * as A from './arctic';
import * as J from './jungle';
import * as Q from './sequel';
import * as O6 from './ocean';

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
  jungle: J.Jungle, canopy: J.Canopy, riverBoat: J.RiverBoat, tomas: J.Tomas, rosa: J.Rosa, camp: J.Camp, campNight: J.CampNight,
  macaw: J.MacawSet, kapok: J.Kapok, gps: J.Gps, shelter: J.Shelter, waterLeaf: J.WaterLeaf, vine: J.Vine, monkeys: J.Monkeys,
  treeMark: J.TreeMark, circlePath: J.CirclePath, igapo: J.Igapo, caiman: J.Caiman, raft: J.Raft, riverWide: J.RiverWide,
  fever: J.Fever, rosaCanoe: J.RosaCanoe, village: J.Village,
  countdown: Q.Countdown, keyboard: Q.Keyboard, earthCore: Q.EarthCore, earthOrbit: Q.EarthOrbit, solarStorm: Q.SolarStorm,
  crowd: Q.Crowd, door: Q.Door, sister: Q.Sister, hug: Q.Hug, carterRoom: Q.CarterRoom,
  ocean: O6.Ocean, liferaft: O6.Raft, raftInside: O6.RaftInside, inventory: O6.Inventory, leon: O6.Leon, hana: O6.Hana,
  yacht: O6.YachtSet, yachtCabin: O6.YachtCabin, container: O6.Container, sinking: O6.Sinking, sun: O6.Sun, solarStill: O6.SolarStill,
  rainCatch: O6.RainCatch, freighter: O6.Freighter, flareSea: O6.FlareSea, mirror: O6.Mirror, underwater: O6.Underwater,
  underwaterDark: O6.UnderwaterDark, flyingFish: O6.FlyingFish, biolum: O6.Biolum, stormSea: O6.StormSea, albatross: O6.AlbatrossSet,
  albatrossBand: O6.AlbatrossBand, sky: O6.SkySet, sailRaft: O6.SailRaft, lagoonWater: O6.LagoonWater, atoll: O6.Atoll, reef: O6.Reef,
  clock: wrap(S.S02), hallway: wrap(S.S05), livingWalk: wrap(S.S07), trafficLight: wrap(S.S10), title: wrap(S.S13),
};
