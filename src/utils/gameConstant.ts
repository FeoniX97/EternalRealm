export default {
  character: {
    exp: {
      defaultMax: 100,
      growthRate: 0.2,
    },
    living: {
      level: 1,
      core: {
        str: {
          default: 1,
        },
        agi: {
          default: 1,
        },
        int: {
          default: 1,
        },
        unallocated: 0,
      },
      resource: {
        life: {
          default: 100,
        },
        mana: {
          default: 100,
        },
        es: {
          default: 100,
        },
      },
    },
  },
  db: {
    /** the timeout left to perform the next update to DB */
    timeout: 1000,
  },
};
