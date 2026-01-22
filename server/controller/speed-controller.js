// No need to import express here

// 1. Ping Controller
export const pingCheck = async (req, res) => {
  return res.status(200).send('pong');
};

// 2. Download Controller
export const downloadTest = async (req, res) => {
  const sizeMB = 25;
  const buffer = Buffer.alloc(sizeMB * 1024 * 1024);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', buffer.length);

  return res.status(200).send(buffer);
};

// 3. Upload Controller
export const uploadTest = async (req, res) => {
  return res.status(200).json({
    received: req.body.length
  });
};
