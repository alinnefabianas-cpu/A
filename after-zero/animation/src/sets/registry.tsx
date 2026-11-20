import React from 'react';
import * as S from '../scenes';
import {SetProps} from './common';
import * as E from './exteriors';
import * as I from './interiors';
import * as O from './observatory';

const wrap = (C: React.FC<any>): React.FC<SetProps> => ({dur}) => <C dur={dur} title="WHAT IF YOU WERE THE LAST HUMAN ON EARTH?" />;

export const SETS: Record<string, React.FC<SetProps>> = {
  city: E.City, windowBack: E.WindowBack, street: E.Street, noahStreet: E.NoahStreet, streetWide: E.StreetWide,
  windowNight: E.WindowNight, rooftop: E.Rooftop, journey: E.Journey, campfire: E.Campfire, obsExt: E.ObsExt,
  skyRing: E.SkyRing, obsWindow: E.ObsWindow, sunriseEnding: E.SunriseEnding,
  bedroom: I.Bedroom, tableSit: I.TableSit, phone: I.Phone, stairs: I.Stairs, tv: I.TV, supermarket: I.Supermarket,
  hospital: I.Hospital, subway: I.Subway, police: I.Police, electronics: I.Electronics, radioClose: I.RadioClose,
  tally: I.Tally, map: I.MapSet,
  profile: O.Profile, aerial: O.Aerial, obsInt: O.ObsInt, monitor: O.Monitor, dataScreen: O.DataScreen,
  pinboard: O.Pinboard, screensAll: O.ScreensAll, black: O.Black, chapter: O.Chapter, endCard: O.EndCard,
  clock: wrap(S.S02), hallway: wrap(S.S05), livingWalk: wrap(S.S07), trafficLight: wrap(S.S10), title: wrap(S.S13),
};
