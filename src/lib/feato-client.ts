import { FeatoClientConfig } from './types/config';
import { FeatureFlagsMap } from './types/api';
import { FeatureFlagEvent } from './types/events';

const apiUrl = 'https://hub.feato.io/v1';

type FlagsListener = (flags: FeatureFlagsMap) => void;
type InitListener = (initialized: boolean) => void;

export class FeatoClient {
  private readonly _flagsListeners = new Set<FlagsListener>();
  private readonly _initListeners = new Set<InitListener>();

  private _flags: FeatureFlagsMap = {};
  private _initialized = false;

  private _eventSource?: EventSource;
  private _reconnectAttempts = 0;
  private _reconnectTimeoutId?: number;
  private _maxReconnectDelay = 30000; // 30 seconds
  private _baseReconnectDelay = 1000; // 1 second

  get flags(): FeatureFlagsMap {
    return this._flags;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  constructor(private readonly _config: FeatoClientConfig) {}

  private _connect(): void {
    if (this._eventSource) {
      return;
    }

    if (typeof EventSource === 'undefined') {
      return;
    }

    const params = new URLSearchParams({ secret: this._config.projectKey, environment: this._config.environment, version: '1' });

    this._eventSource = new EventSource(`${apiUrl}/hub?${params.toString()}`);

    this._eventSource.onmessage = (event) => {
      const raw = JSON.parse(event.data) as {
        key: string;
        value: boolean | null;
        updatedAt?: string;
      };

      const payload: FeatureFlagEvent = {
        key: raw.key,
        value: raw.value,
        updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(0),
      };

      this._proceedEvent(payload);
    };

    this._eventSource.onerror = () => {
      this._handleConnectionError();
    };
  }

  private _proceedEvent(event: FeatureFlagEvent): void {
    this._flags = { ...this._flags, [event.key]: event.value ?? false };

    this.emitFlags();

    // Reset reconnect attempts on successful message
    this._reconnectAttempts = 0;
  }

  private emitFlags(): void {
    for (const listener of this._flagsListeners) {
      listener(this._flags);
    }
  }

  private emitInitialized(): void {
    for (const listener of this._initListeners) {
      listener(this._initialized);
    }
  }

  async init(): Promise<void> {
    if (this._initialized) {
      return;
    }

    const params = new URLSearchParams({ secret: this._config.projectKey, environment: this._config.environment });
    const response = await fetch(`${apiUrl}/feature-flag?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`FeatoClient init failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { flags: FeatureFlagsMap };

    this._flags = data.flags;
    this._initialized = true;

    this.emitFlags();
    this.emitInitialized();
    this._connect();
  }

  private _handleConnectionError(): void {
    this._eventSource?.close();
    this._eventSource = undefined;

    // Calculate delay with exponential backoff
    const delay = Math.min(this._baseReconnectDelay * Math.pow(2, this._reconnectAttempts), this._maxReconnectDelay);

    this._reconnectAttempts++;

    console.log(`FeatoClient: Connection lost. Reconnecting in ${delay}ms (attempt ${this._reconnectAttempts})...`);

    this._reconnectTimeoutId = setTimeout(() => {
      this._connect();
    }, delay);
  }

  /**
   * Close SSE connection
   */
  disconnect(): void {
    if (this._reconnectTimeoutId) {
      clearTimeout(this._reconnectTimeoutId);
      this._reconnectTimeoutId = undefined;
    }

    this._eventSource?.close();
    this._eventSource = undefined;
    this._reconnectAttempts = 0;
  }

  /**
   * Subscriptions (framework-agnostic)
   */
  subscribeFlags(listener: FlagsListener): () => void {
    this._flagsListeners.add(listener);

    listener(this._flags);

    return () => {
      this._flagsListeners.delete(listener);
    };
  }

  subscribeInitialized(listener: InitListener): () => void {
    this._initListeners.add(listener);

    listener(this._initialized);

    return () => {
      this._initListeners.delete(listener);
    };
  }
}
