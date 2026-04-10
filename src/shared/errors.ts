export class WalletError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'WalletError';
  }
}

export class EncryptionError extends WalletError {
  constructor(message: string) {
    super(message, 'ENCRYPTION_ERROR');
    this.name = 'EncryptionError';
  }
}

export class StorageError extends WalletError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

export class TransactionError extends WalletError {
  constructor(message: string) {
    super(message, 'TRANSACTION_ERROR');
    this.name = 'TransactionError';
  }
}

export class SmartAccountError extends WalletError {
  constructor(message: string) {
    super(message, 'SMART_ACCOUNT_ERROR');
    this.name = 'SmartAccountError';
  }
}
