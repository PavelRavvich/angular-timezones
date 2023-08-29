import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class CookieStorageService {

  public static readonly TIMEZONES_COOKIE_KEY = 'user_timezones';

  public setCookie(key: string, value: string | null): void {
    if (!key) { return; }

    const encodedValue = value != null ? encodeURIComponent(value) : value;
    const option = value == null
      ? 'expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      : 'max-age=31536000;';
    document.cookie = `${key}=${encodedValue};${option}path=/;`;
  }

  public getCookie(key: string): string | null {
    if (!key) { return null; }

    const clearKey = key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
    const matches = document.cookie
      .split(';')
      .find(c => c.trim().startsWith(clearKey + '='));

    return matches ? decodeURIComponent(matches.split('=')[1].trim()) : null;
  }

  public removeCookie(key: string): void {
    this.setCookie(key, null);
  }
}
