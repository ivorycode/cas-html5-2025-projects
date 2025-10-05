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

/*Defines Date Structure of Defect */
import { DefectStates } from './DefectState';
import { DefectCategories } from './DefectCategory';
import { PostGISLocation } from './Location';

export interface DefectView {
  id: number | undefined;
  user_id: string | undefined;
  title: string;
  category: DefectCategories;
  description: string;
  state: DefectStates;
  numberOfVotes: number;
  createdAt: string;
  updatedAt: string;
  location: PostGISLocation;
  photos: string[];
}

export interface DefectInsert {
  user_id: string;
  title: string;
  category: DefectCategories;
  description: string;
  state: DefectStates;
  location: PostGISLocation;
}

export interface DefectUpdate {
  title: string;
  category: DefectCategories;
  description: string;
  state: DefectStates;
  location: PostGISLocation;
  updatedAt: string;
}
