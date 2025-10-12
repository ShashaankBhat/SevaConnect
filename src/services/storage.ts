class StorageService {
  private readonly TOKEN_KEY = 'sevaconnect_token';
  private readonly USER_KEY = 'sevaconnect_user';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  clearAuth() {
    this.removeToken();
    this.removeUser();
  }
}

export const storageService = new StorageService();
