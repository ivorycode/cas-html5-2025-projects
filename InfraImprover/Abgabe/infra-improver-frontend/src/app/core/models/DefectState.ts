/*
_____          __                       _____
|_   _|        / _|                     |_   _|
 | |   _ __  | |_  _ __   __ _  ______   | |   _ __ ___   _ __   _ __   ___  __   __  ___  _ __
 | |  | '_ \ |  _|| '__| / _` ||______|  | |  | '_ ` _ \ | '_ \ | '__| / _ \ \ \ / / / _ \| '__|
 | |_ | | | || |  | |   | (_| |         _| |_ | | | | | || |_) || |   | (_) | \ V / |  __/| |
 \___/ |_| |_||_|  |_|    \__,_|         \___/ |_| |_| |_|| .__/ |_|    \___/   \_/   \___||_|
                                                          | |
                                                          |_|
  Copyright @Beat Weisskopf, Sandrine Ngo-Dinh, Yves Jegge
*/

/*Defines Enumeration States of Defect */
export const DefectState = {
  Open: 'Open',
  InProgress: 'InProgress',
  Closed: 'Closed',
} as const;

export type DefectStates = (typeof DefectState)[keyof typeof DefectState];
export const DefectStateMap = new Map([
  [DefectState.Open, 'Offen'],
  [DefectState.InProgress, 'In Bearbeitung'],
  [DefectState.Closed, 'Geschlossen'],
]);

export const DefectStateSeverityMap = new Map([
  [DefectState.Open, 'danger'],
  [DefectState.InProgress, 'warn'],
  [DefectState.Closed, 'success'],
]);

export const DefectStateColorMap = new Map([
  [DefectState.Open, 'red'],
  [DefectState.InProgress, 'orange'],
  [DefectState.Closed, 'green'],
]);
