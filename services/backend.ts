import { UserProfile, UserRole, RideRequest, IncidentReport, Driver, RideStatus, RideType, Location, AuditLog, WalletTransaction, UserSettings } from '../types';

// Initial Mock Data
const INITIAL_LOCATIONS: Location[] = [
  { id: '1', name: 'Mercado Central Inhambane', lat: -23.865, lng: 35.383 },
  { id: '2', name: 'Praia do Tofo', lat: -23.854, lng: 35.545 },
  { id: '3', name: 'Maxixe Terminal', lat: -23.859, lng: 35.347 },
  { id: '4', name: 'Aeroporto Inhambane', lat: -23.874, lng: 35.399 },
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'pt',
  notifications: true
};

const INITIAL_USERS: UserProfile[] = [
  { id: 'admin1', name: 'Administrador', email: 'admin@fambago.mz', password: '123', role: UserRole.ADMIN, phone: '+258841234567', settings: DEFAULT_SETTINGS },
  { id: 'agent1', name: 'Agente Carlos', email: 'agent@fambago.mz', password: '123', role: UserRole.AGENT, phone: '+258849876543', settings: DEFAULT_SETTINGS },
  { id: 'driver1', name: 'João Motas', email: 'driver@fambago.mz', password: '123', role: UserRole.DRIVER, phone: '+258841112223', settings: DEFAULT_SETTINGS },
  { id: 'user1', name: 'Maria Passageira', email: 'user@fambago.mz', password: '123', role: UserRole.PASSENGER, phone: '+258843334445', settings: DEFAULT_SETTINGS },
];

const INITIAL_DRIVER_STATS: Driver = {
  id: 'driver1',
  name: 'João Motas',
  rating: 4.8,
  ridesCompleted: 1240,
  vehiclePlate: 'ABC-123-MC',
  avatar: 'https://picsum.photos/id/64/100/100',
  isOnline: false,
  location: INITIAL_LOCATIONS[0],
  points: 450,
  level: 'Bronze'
};

const INITIAL_REPORTS: IncidentReport[] = [
  { id: '1', agentId: 'agent1', type: 'Infração', description: 'Mototaxista sem capacete e com 2 passageiros.', location: 'Av. Eduardo Mondlane, Maxixe', time: '10:30', status: 'Pendente' },
  { id: '2', agentId: 'agent1', type: 'Via Danificada', description: 'Buraco grande próximo ao mercado central.', location: 'Mercado Central, Inhambane', time: '08:15', status: 'Resolvido' },
];

const INITIAL_RIDES: RideRequest[] = [
  { 
    id: 'ride1', 
    userId: 'user1', 
    pickup: INITIAL_LOCATIONS[0], 
    dropoff: INITIAL_LOCATIONS[1], 
    type: RideType.QUICK, 
    price: 250, 
    distance: 12, 
    status: RideStatus.SCHEDULED,
    scheduledTime: new Date(Date.now() + 86400000).toISOString() // Tomorrow
  }
];

class BackendService {
  private usersKey = 'fambago_users';
  private ridesKey = 'fambago_rides';
  private reportsKey = 'fambago_reports';
  private driverKey = 'fambago_driver_stats';
  private sessionKey = 'fambago_session';
  private auditKey = 'fambago_audit_logs';
  private walletKey = 'fambago_wallet_txs';

  constructor() {
    this.initializeDatabase();
  }

  // Simulates Flask @app.before_first_request or DB Migration script
  private initializeDatabase() {
    console.log("[Flask Backend Simulado] Inicializando conexão...");
    console.log("[SQLAlchemy] Verificando integridade das tabelas (sqlite:///fambago.db)...");
    
    if (!localStorage.getItem(this.usersKey)) {
      console.log("[DB Seed] Criando tabela 'users' e inserindo dados iniciais...");
      localStorage.setItem(this.usersKey, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(this.ridesKey)) {
      console.log("[DB Seed] Criando tabela 'rides'...");
      localStorage.setItem(this.ridesKey, JSON.stringify(INITIAL_RIDES));
    }
    if (!localStorage.getItem(this.reportsKey)) {
      console.log("[DB Seed] Criando tabela 'reports'...");
      localStorage.setItem(this.reportsKey, JSON.stringify(INITIAL_REPORTS));
    }
    if (!localStorage.getItem(this.driverKey)) {
      localStorage.setItem(this.driverKey, JSON.stringify(INITIAL_DRIVER_STATS));
    }
    if (!localStorage.getItem(this.auditKey)) {
      localStorage.setItem(this.auditKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.walletKey)) {
      localStorage.setItem(this.walletKey, JSON.stringify([]));
    }
    console.log("[Flask Backend] Servidor pronto e escutando na porta 5000 (Simulada).");
  }

  // --- Auth ---

  async login(email: string, password?: string): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 600)); // Network delay
    
    // Bypass password check for GUEST
    if (email === 'guest@fambago.mz') {
      const guest: UserProfile = { 
        id: 'guest', 
        name: 'Visitante', 
        email, 
        role: UserRole.GUEST,
        settings: DEFAULT_SETTINGS
      };
      this.setSession(guest);
      this.logAudit(guest.id, 'LOGIN', 'guest', 'User logged in as guest');
      return guest;
    }

    const users: UserProfile[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) throw new Error('Credenciais inválidas');
    
    this.setSession(user);
    this.logAudit(user.id, 'LOGIN', user.id, 'User logged in successfully');
    return user;
  }

  async socialLogin(provider: 'google' | 'facebook'): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 1500)); // Simulate OAuth popup delay

    const email = `user@${provider}.com`;
    const users: UserProfile[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    let user = users.find(u => u.email === email);

    if (!user) {
      // Create new social user if doesn't exist
      user = {
        id: Math.random().toString(36).substr(2, 9),
        name: provider === 'google' ? 'Usuário Google' : 'Usuário Facebook',
        email: email,
        role: UserRole.PASSENGER,
        password: 'social_login_dummy_pass',
        settings: DEFAULT_SETTINGS
      };
      users.push(user);
      localStorage.setItem(this.usersKey, JSON.stringify(users));
      this.logAudit(user.id, 'REGISTER_SOCIAL', user.id, `User registered via ${provider}`);
    }

    this.setSession(user);
    this.logAudit(user.id, 'LOGIN_SOCIAL', user.id, `User logged in via ${provider}`);
    return user;
  }

  async register(user: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 800));
    
    const users: UserProfile[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    if (users.find(u => u.email === user.email)) {
      throw new Error('E-mail já cadastrado');
    }

    const newUser: UserProfile = { 
      ...user, 
      id: Math.random().toString(36).substr(2, 9),
      settings: DEFAULT_SETTINGS
    };
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    
    this.createWallet(newUser.id); // Give sign-up bonus
    this.setSession(newUser);
    this.logAudit(newUser.id, 'REGISTER', newUser.id, 'New user registration');
    return newUser;
  }

  async recoverPassword(email: string): Promise<void> {
    await new Promise(r => setTimeout(r, 1200)); // Simulate API call
    console.log(`[Email Service] Enviando e-mail de recuperação para ${email}...`);
    // Here we would call the real backend endpoint /api/auth/recover-password
    
    const users: UserProfile[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
      this.logAudit(user.id, 'RECOVER_PASSWORD', user.id, 'Password reset requested');
      console.log(`[Email Service] E-mail enviado com sucesso (Simulado).`);
    } else {
      console.log(`[Email Service] E-mail não encontrado (Silent fail para segurança).`);
    }
    // Always resolve successfully to prevent user enumeration
    return;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 400));
    const users: UserProfile[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) throw new Error("User not found");
    
    // Merge updates
    const updatedUser = { ...users[index], ...updates };
    
    // If settings are nested, ensure they merge correctly
    if (updates.settings && users[index].settings) {
        updatedUser.settings = { ...users[index].settings, ...updates.settings };
    }

    users[index] = updatedUser;
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    
    // Update session if it's the current user
    const currentSession = this.getSession();
    if (currentSession && currentSession.id === userId) {
        this.setSession(updatedUser);
    }

    this.logAudit(userId, 'UPDATE_PROFILE', userId, 'User updated profile/settings');
    return updatedUser;
  }

  logout() {
    const user = this.getSession();
    if (user) this.logAudit(user.id, 'LOGOUT', user.id, 'User logged out');
    localStorage.removeItem(this.sessionKey);
  }

  getSession(): UserProfile | null {
    const session = localStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }

  private setSession(user: UserProfile) {
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
  }

  // --- Rides ---

  async getRides(userId?: string): Promise<RideRequest[]> {
    await new Promise(r => setTimeout(r, 300));
    const allRides: RideRequest[] = JSON.parse(localStorage.getItem(this.ridesKey) || '[]');
    if (userId) {
      return allRides.filter(r => r.userId === userId || r.driverId === userId);
    }
    return allRides;
  }

  async createRide(ride: RideRequest): Promise<RideRequest> {
    const allRides: RideRequest[] = JSON.parse(localStorage.getItem(this.ridesKey) || '[]');
    const newRide = { ...ride, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    allRides.push(newRide);
    localStorage.setItem(this.ridesKey, JSON.stringify(allRides));
    
    if (ride.userId) {
      this.updateWallet(ride.userId, -ride.price, `Pagamento de corrida: ${ride.type}`);
      this.logAudit(ride.userId, 'CREATE_RIDE', newRide.id || '', 'Ride requested');
    }
    
    return newRide;
  }

  // --- Driver ---

  async getDriverStats(): Promise<Driver> {
    const stats: Driver = JSON.parse(localStorage.getItem(this.driverKey) || 'null');
    return stats || INITIAL_DRIVER_STATS;
  }

  async updateDriverPoints(pointsToAdd: number): Promise<Driver> {
    let stats = await this.getDriverStats();
    stats.points += pointsToAdd;
    
    // Level up logic
    if (stats.points > 2000) stats.level = 'Diamante';
    else if (stats.points > 1000) stats.level = 'Ouro';
    else if (stats.points > 500) stats.level = 'Prata';
    
    localStorage.setItem(this.driverKey, JSON.stringify(stats));
    return stats;
  }

  // --- Reports (Agent) ---

  async getReports(): Promise<IncidentReport[]> {
    return JSON.parse(localStorage.getItem(this.reportsKey) || '[]');
  }

  async createReport(report: IncidentReport): Promise<IncidentReport> {
    const reports: IncidentReport[] = JSON.parse(localStorage.getItem(this.reportsKey) || '[]');
    const newReport = { ...report, id: Math.random().toString(36).substr(2, 9) };
    reports.unshift(newReport); // Add to top
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));
    
    const user = this.getSession();
    if (user) this.logAudit(user.id, 'CREATE_REPORT', newReport.id, `Report created: ${report.type}`);
    
    return newReport;
  }

  // --- Audit & Governance ---

  private logAudit(userId: string, action: string, entityId: string, details: string) {
    const logs: AuditLog[] = JSON.parse(localStorage.getItem(this.auditKey) || '[]');
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: userId,
      action,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep only last 100 logs for prototype
    if (logs.length > 100) logs.pop();
    localStorage.setItem(this.auditKey, JSON.stringify(logs));
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return JSON.parse(localStorage.getItem(this.auditKey) || '[]');
  }

  async exportDatabase(): Promise<string> {
    const data = {
      users: JSON.parse(localStorage.getItem(this.usersKey) || '[]'),
      rides: JSON.parse(localStorage.getItem(this.ridesKey) || '[]'),
      reports: JSON.parse(localStorage.getItem(this.reportsKey) || '[]'),
      audit: JSON.parse(localStorage.getItem(this.auditKey) || '[]'),
      wallet: JSON.parse(localStorage.getItem(this.walletKey) || '[]'),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // --- Wallet ---

  private createWallet(userId: string) {
    // Welcome bonus
    this.updateWallet(userId, 500, 'Bônus de Boas-vindas');
  }

  async getWalletBalance(userId: string): Promise<number> {
    const txs: WalletTransaction[] = JSON.parse(localStorage.getItem(this.walletKey) || '[]');
    const userTxs = txs.filter(t => t.userId === userId);
    return userTxs.reduce((acc, tx) => tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount, 0);
  }

  async updateWallet(userId: string, amount: number, description: string) {
    const txs: WalletTransaction[] = JSON.parse(localStorage.getItem(this.walletKey) || '[]');
    const newTx: WalletTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      amount: Math.abs(amount),
      type: amount >= 0 ? 'CREDIT' : 'DEBIT',
      description,
      timestamp: new Date().toISOString()
    };
    txs.push(newTx);
    localStorage.setItem(this.walletKey, JSON.stringify(txs));
  }
}

export const backendService = new BackendService();