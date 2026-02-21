export const sealConfig = <T = any>(value: T) => {
  const sealed = {
    getSecret() {
      return value;
    },

    toJSON() {
      return "***";
    },

    toString() {
      return "***";
    },
  };

  return sealed;
};
