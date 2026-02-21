import { createApp } from "./app/app";

// ----------------------------------------------------------------------

const PORT = process.env.PORT || 3002;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Report Service running on port ${PORT}`);
});
