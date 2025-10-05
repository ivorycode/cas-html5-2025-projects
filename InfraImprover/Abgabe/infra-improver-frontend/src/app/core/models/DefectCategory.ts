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

/*Defines Enumeration Categories of Defect */
export const DefectCategory = {
  Pedestrian: 'Pedestrian',
  Bicycle: 'Bicycle',
  StreetDefect: 'StreetDefect',
  TrainStationDefect: 'TrainStationDefect',
  BridgeDefect: 'BridgeDefect',
  PlaygroundDefect: 'PlaygroundDefect',
  DisabilityImprovement: 'DisabilityImprovement',
  Undefined: 'Undefined',
} as const;

export type DefectCategories = (typeof DefectCategory)[keyof typeof DefectCategory];
export const DefectCategoryMap = new Map([
  [DefectCategory.Undefined, 'Andere'],
  [DefectCategory.Pedestrian, 'Fussverkehr'],
  [DefectCategory.Bicycle, 'Veloverkehr'],
  [DefectCategory.StreetDefect, 'Strasse'],
  [DefectCategory.TrainStationDefect, 'Öffentlicher Verkehr'],
  [DefectCategory.BridgeDefect, 'Brücke'],
  [DefectCategory.PlaygroundDefect, 'Spielplatz'],
  [DefectCategory.DisabilityImprovement, 'Fehlende Barrierefreiheit'],
]);

export const DefectCategoryReverseMap = new Map(
  Array.from(DefectCategoryMap, ([key, value]) => [value, key]),
);
