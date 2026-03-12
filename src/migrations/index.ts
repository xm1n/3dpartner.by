import * as migration_20260312_213930_initial from './20260312_213930_initial';

export const migrations = [
  {
    up: migration_20260312_213930_initial.up,
    down: migration_20260312_213930_initial.down,
    name: '20260312_213930_initial'
  },
];
