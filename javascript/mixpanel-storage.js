import {MixpanelLogger} from "mixpanel-react-native/javascript/mixpanel-logger";

export class AsyncStorageAdapter {
  constructor(storage) {
    if (!storage) {
      try {
        const { MMKV } = require("react-native-mmkv");
        this.storage = new MMKV({ id: `statistic-storage` });
      } catch {
        console.error(
          "[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null. Please run 'npm install react-native-mmkv' or follow the Mixpanel guide to set up your own Storage class."
        );
        console.error("[Mixpanel] Falling back to in-memory storage");
        this.storage = new InMemoryStorage();
      }
    } else {
      this.storage = storage;
    }
  }

  getItem(key) {
    try {
      return this.storage.getString(key);
    } catch {
      MixpanelLogger.error("error getting item from storage");
      return null;
    }
  }

  setItem(key, value) {
    try {
      this.storage.set(key, value);
    } catch {
      MixpanelLogger.error("error setting item in storage");
    }
  }

  removeItem(key) {
    try {
      this.storage.delete(key);
    } catch {
      MixpanelLogger.error("error removing item from storage");
    }
  }
}

class InMemoryStorage {
  constructor() {
    this.store = {};
  }

  async getItem(key) {
    return this.store.hasOwnProperty(key) ? this.store[key] : null;
  }

  async setItem(key, value) {
    this.store[key] = value;
  }

  async removeItem(key) {
    delete this.store[key];
  }
}
