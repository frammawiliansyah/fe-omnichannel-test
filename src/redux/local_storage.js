const storage = {
  store: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  },
  get: key => {
    try {
      const value = localStorage.getItem(key);
      return JSON.parse(value);
    } catch (error) {
      console.log(error);
    }
  },
  delete: key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }
};

export { storage };
