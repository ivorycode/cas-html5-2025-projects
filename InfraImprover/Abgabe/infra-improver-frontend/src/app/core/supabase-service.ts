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

import { Injectable, inject } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { FileObject } from '@supabase/storage-js';
import { env } from '../environments/env';
import { DefectCategories } from './models/DefectCategory';
import { DefectInsert, DefectUpdate, DefectView } from './models/Defect';
import { Vote } from './models/Vote';
import { DefectStates } from './models/DefectState';
import { PostGISLocationBoundaries, PostGISLocationWithRadius } from './models/Location';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private _supabase: SupabaseClient;
  private http_ = inject(HttpClient);

  constructor() {
    this._supabase = createClient(env.supabaseUrl, env.supabaseKey);
    this._supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.onAuthStateChangeCallback(event, session);
    });
  }

  public onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this._supabase.auth.onAuthStateChange(callback);
  }

  public async signUpUser(email: string, password: string) {
    console.log(`Try to sign-up user: ${email}.`);
    return await this._supabase.auth.signUp({ email, password });
  }

  public async signInUser(email: string, password: string) {
    console.log(`Try to sign-in user: ${email}.`);
    return await this._supabase.auth.signInWithPassword({ email, password });
  }

  public async restoreUserPassword(email: string) {
    const redirectUrl = `${window.location.origin}/login/reset-password`;
    console.log(`Try to restore password ${email}, redirectUrl: ${redirectUrl}.`);
    return await this._supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
  }

  async setSessionFromRecoveryToken(token: string) {
    return this._supabase.auth.exchangeCodeForSession(token);
  }

  async updateUserPassword(newPassword: string) {
    console.log(`Try to update passwort.`);
    return await this._supabase.auth.updateUser({ password: newPassword });
  }

  public async signOutUser() {
    console.log(`Try to sign-out user.`);
    localStorage.removeItem('isLoggedIn');
    return await this._supabase.auth.signOut();
  }

  public isUserSignIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  public async getUser() {
    console.log(`Try to get user.`);
    return await this._supabase.auth.getUser();
  }

  public async getCategories(): Promise<DefectCategories[]> {
    console.log(`Try to get categories.`);
    const response = await this._supabase.rpc('get_enum_values', {
      enum_type: 'Categories',
    });
    return response.data as DefectCategories[];
  }

  public async getStates(): Promise<DefectStates[]> {
    console.log(`Try to get states.`);
    const response = await this._supabase.rpc('get_enum_values', {
      enum_type: 'States',
    });
    return response.data as DefectStates[];
  }

  public async getDefects(): Promise<DefectView[]> {
    console.log(`Try to get defects.`);
    const { data, error } = await this._supabase.from('defects').select('*');
    console.log('data:');
    console.log(data);
    if (error) {
      console.error(`Get Defects failed' ${error}`);
      throw error;
    }
    return data as DefectView[];
  }

  public async getDefectsInView(boundary: PostGISLocationBoundaries): Promise<DefectView[]> {
    const min_lat = boundary.southWestLat;
    const min_long = boundary.southWestLng;
    const max_lat = boundary.northEastLat;
    const max_long = boundary.northEastLng;
    const { data, error } = await this._supabase.rpc('defects_in_view', {
      min_lat,
      min_long,
      max_lat,
      max_long,
    });
    if (error) {
      console.error(`Get Defects In View failed' ${error}`);
      throw error;
    }
    console.log(`Gets Defects in: ${min_lat} ${min_long}  ${max_lat} ${max_long}: ${data}.`);
    console.log(data);
    return data as DefectView[];
  }

  public async getDefectsInRadius(location: PostGISLocationWithRadius): Promise<DefectView[]> {
    const center_lat = location.coordinates[0];
    const center_lon = location.coordinates[1];
    const radius_meters = location.radius_in_meters;
    const { data, error } = await this._supabase.rpc('get_defects_in_radius', {
      center_lat,
      center_lon,
      radius_meters,
    });
    if (error) {
      console.error(`Get Defects In Radius failed' ${error}`);
      throw error;
    }
    console.log(`Gets Defects in Radius: ${center_lat} ${center_lon} ${radius_meters}: ${data}.`);
    console.log(data);
    return data as DefectView[];
  }

  public async createDefect(defect: DefectInsert): Promise<DefectView> {
    console.log('Try to create defects.');
    const { data, error } = await this._supabase
      .from('defects')
      .insert(defect)
      .select()
      .single<DefectView>();
    if (error) {
      throw error;
    }
    return data;
  }

  public async uploadPhotoOfDefect(defect: DefectView, file: File): Promise<void> {
    console.log(`Try to upload photos ${file}`);
    const responseUser = await this._supabase.auth.getUser();
    if (responseUser.error) {
      console.error(`Upload Photo failed' ${responseUser.error}`);
      throw responseUser.error;
    }
    if (!responseUser.data) {
      console.error(`Upload Photo failed, since to data were returned`);
      throw Error('User is not logged in!');
    }
    const path = `defects/${defect.id}/${file.name}`;
    const { error } = await this._supabase.storage
      .from('photos')
      .upload(path, file, { upsert: false });
    if (error) {
      throw error;
    }
  }

  public async getImagePaths(defect: DefectView): Promise<FileObject[]> {
    console.log(`Image of defect: ${defect.title}`);
    const path = `defects/${defect.id}`;
    const { data, error } = await this._supabase.storage.from('photos').list(path);
    if (error || !data) {
      console.error(`Get Images failed' ${error}`);
      return [];
    }
    return data.filter((file) => file.name.match(/\.(jpg|jpeg|png|webp)$/i));
  }

  public async getImage(defect: DefectView, file: FileObject): Promise<string> {
    const path = `defects/${defect.id}`;
    console.log(`Image of defect: ${defect.title}`);
    return this._supabase.storage
      .from('photos')
      .createSignedUrl(`${path}/${file.name}`, 60 * 60, {
        transform: {
          width: 400,
          height: 400,
          quality: 80,
        },
      })
      .then((res) => res.data?.signedUrl || '');
  }

  public async upVote(vote: Vote) {
    const { error } = await this._supabase.from('votes').insert(vote);
    console.log(`Try to up vote: id:' ${vote.defect_id} id: ${vote.user_id}`);
    if (error) {
      console.error(`Up-Vote failed' ${error}`);
      throw error;
    }
  }

  public async downVote(vote: Vote) {
    console.log(`Try to down vote: id:' ${vote.defect_id} id: ${vote.user_id}`);
    const { error } = await this._supabase
      .from('votes')
      .delete()
      .eq('user_id', vote.user_id)
      .eq('defect_id', vote.defect_id);

    if (error) {
      console.error(`Down-Vote failed' ${error}`);
      throw error;
    }
  }

  // Checks if the user has already voted for a given defect.
  public async canUpVote(vote: Vote): Promise<boolean> {
    const { count, error } = await this._supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('defect_id', vote.defect_id)
      .eq('user_id', vote.user_id);
    if (error) {
      console.error(`Up vote failed' ${error}`);
      throw error;
    }
    return count === 0;
  }

  // Checks if the user can  /delete/marked as done a defect. He only can edit his own defect.
  public async canEditDefect(defect_id: number, user_id: string): Promise<boolean> {
    console.log('Call can edit defect on db - defectId=' + defect_id + 'userId=' + user_id);
    const { data, error } = await this._supabase
      .from('defects')
      .select('id')
      .eq('id', defect_id)
      .eq('user_id', user_id);
    if (error) {
      console.error(`Get edit status failed' ${error}`);
      return false;
    }

    console.log('CanEditDefect: ' + data?.length);

    return data?.length > 0;
  }

  // Deletes the defect.
  public async deleteDefect(defect_id: number, user_id: string): Promise<boolean> {
    // Remove votes
    const { error: votesError } = await this._supabase
      .from('votes')
      .delete()
      .eq('defect_id', defect_id);
    if (votesError) {
      console.error(`Delete votes failed:' ${votesError}`);
      return false;
    }

    // Remove the defect
    const { error: defectError } = await this._supabase
      .from('defects')
      .delete()
      .eq('id', defect_id)
      .eq('user_id', user_id);

    if (defectError) {
      console.error(`Delete defect failed:' ${defectError}`);
      return false;
    }
    return true;
  }

  // Updates the defect.
  public async updateDefect(defect_id: number, updatedDefect: DefectUpdate): Promise<DefectView> {
    console.log('Updated defect to db');
    const { data, error } = await this._supabase
      .from('defects')
      .update(updatedDefect)
      .eq('id', defect_id)
      .select()
      .single<DefectView>();

    if (error) {
      throw error;
    }
    console.log('Updated defect:', data);
    await this.triggerStatusChangeEmail();
    return data;
  }

  async triggerStatusChangeEmail(): Promise<void> {
    console.log('Trigger email:', `${env.emailTriggerUrl}`);

    return new Promise((resolve, reject) => {
      this.http_.post(`${env.emailTriggerUrl}`, {}).subscribe({
        next: () => {
          console.log('Email trigger sent');
          resolve();
        },
        error: (err) => {
          console.error('Error triggering email:', err);
          reject(err);
        },
      });
    });
  }

  private onAuthStateChangeCallback(event: AuthChangeEvent, session: Session | null): void {
    const isLoggedIn = session !== null && session?.user !== null;
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    console.log(`User Authentication event: ${event}`);
    console.log(`User Authentication session: ${session}`);
    console.log(`User Authentication isLoggedIn: ${isLoggedIn}`);
  }
}
