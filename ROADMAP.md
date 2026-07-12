Для минимального проекта делай не «сервер хранит пароли», а **зашифрованный vault**, где сервер видит только ciphertext.

Минимальная модель:

### 1. Формат приложения

PWA для телефона:

- адаптивный интерфейс;
- установка на домашний экран;
- offline-режим;
- Service Worker;
- локальный зашифрованный кэш;
- позже можно обернуть в Capacitor.

### 2. Основные функции MVP

- регистрация и вход;
- master password;
- список записей;
- создание, редактирование, удаление;
- поля:
  - title;
  - username;
  - password;
  - URL;
  - notes;

- генератор паролей;
- поиск;
- копирование логина и пароля;
- автоматическая блокировка vault;
- экспорт и импорт зашифрованной резервной копии.

Пока без:

- sharing;
- организаций;
- browser autofill;
- командного доступа;
- восстановления master password;
- сложной синхронизации конфликтов.

### 3. Ключевой принцип безопасности

Master password никогда не отправляется на сервер.

На клиенте:

```text
masterPassword
    ↓
Argon2id / PBKDF2
    ↓
encryptionKey
    ↓
AES-256-GCM
    ↓
encrypted vault
```

Сервер хранит:

```text
userId
email
passwordAuthHash
encryptedVault
vaultVersion
createdAt
updatedAt
```

Сам сервер не должен уметь расшифровать vault.

### 4. Авторизация и шифрование — разные вещи

Нужно разделить:

- `auth password hash` — для входа;
- `encryption key` — для расшифровки vault.

Лучше использовать:

- Argon2id для derivation;
- AES-256-GCM для шифрования;
- случайный `salt`;
- случайный `nonce/iv`;
- Web Crypto API;
- HttpOnly Secure SameSite cookies;
- CSRF-защиту;
- rate limiting.

Не хранить ключ:

- в localStorage;
- в базе;
- в cookies;
- в логах;
- в analytics.

Ключ держать только в памяти приложения. После блокировки — удалять.

### 5. Архитектура

Для быстрого проекта:

```text
apps/
  web/
    auth/
    vault/
    crypto/
    storage/
    pwa/

  api/
    auth/
    users/
    vault/
    sessions/

packages/
  contracts/
  crypto-model/
```

Frontend:

- React или Vue;
- Vite;
- TypeScript;
- IndexedDB;
- Web Crypto API;
- PWA plugin.

Backend:

- Node.js;
- NestJS или Fastify;
- PostgreSQL;
- Redis для rate limiting и сессий;
- Docker;
- Nginx;
- HTTPS.

### 6. Минимальная модель записи

До шифрования:

```ts
interface VaultItem {
  id: string
  type: 'login'
  title: string
  username?: string
  password?: string
  url?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

Можно шифровать весь vault одним JSON-документом:

```ts
interface Vault {
  version: number
  items: VaultItem[]
}
```

Для MVP это проще, чем шифровать каждую запись отдельно.

### 7. Локальное хранение

В IndexedDB хранить только:

```ts
{
  encryptedVault: string
  iv: string
  salt: string
  version: number
}
```

Не хранить расшифрованные записи постоянно.

### 8. Важные UX-функции для телефона

- разблокировка по PIN только как локальная обёртка;
- позже WebAuthn / biometrics;
- пароль скрыт по умолчанию;
- очистка clipboard через 20–30 секунд;
- автоматическая блокировка через 1–5 минут;
- запрет скриншотов в PWA почти невозможно гарантировать;
- предупреждение при слабом master password.

### 9. Этапы разработки

Первый этап:

```text
Local-only PWA
Master password
Encrypted vault
CRUD записей
IndexedDB
Export/import backup
```

Второй этап:

```text
Backend
Регистрация
Сессии
Синхронизация encrypted vault
Версионирование
Конфликты обновлений
```

Третий этап:

```text
WebAuthn
Biometrics
TOTP
Password health
Capacitor mobile app
```

Самый разумный MVP — сначала полностью локальная PWA без аккаунтов и сервера. Так ты сначала проверишь криптографическую модель, UX и хранение, а синхронизацию добавишь позже. Для реальных паролей проект нельзя считать безопасным без полноценного security review и тестирования криптографической схемы.
