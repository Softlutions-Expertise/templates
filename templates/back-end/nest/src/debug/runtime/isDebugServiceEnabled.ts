export const isDebugServiceEnabled = () => {
  return process.env.ENABLE_DEBUG_SERVICE === 'true';
};
