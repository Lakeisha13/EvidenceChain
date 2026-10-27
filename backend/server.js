
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config();

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1'
});

const bucketName = process.env.S3_BUCKET_NAME;

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

const evidenceRecords = [];
const auditLog = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EvidenceChain API' });
});

app.get('/api/evidence', (req, res) => {
  res.json(evidenceRecords);
});

app.get('/api/audit', (req, res) => {
  res.json(auditLog);
});


app.post('/api/evidence', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.body.caseName || !req.body.evidenceName) {
      return res.status(400).json({
        error: 'Case name, evidence description and file are required.'
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(req.file.buffer)
      .digest('hex');

    const safeFileName = req.file.originalname.replace(
      /[^a-zA-Z0-9._-]/g, '_'
    );
    const objectKey = `evidence/${Date.now()}-${safeFileName}`;

    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    const record = {
      id: `EV-${Date.now().toString().slice(-6)}`,
      caseName: req.body.caseName,
      evidenceName: req.body.evidenceName,
      fileName: req.file.originalname,
      size: req.file.size,
      sha256: hash,
      s3Key: objectKey,
      createdAt: new Date().toISOString(),
      status: 'Registered'
    };

    evidenceRecords.unshift(record);
    auditLog.unshift({
      evidenceId: record.id,
      action: 'EVIDENCE_REGISTERED',
      timestamp: record.createdAt,
      details: 'SHA-256 fingerprint generated; file uploaded to S3.'
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Could not register evidence or upload it to S3.'
    });
  }
});


app.post('/api/evidence/:id/verify', upload.single('file'), (req, res) => {
  const record = evidenceRecords.find(item => item.id === req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Evidence record not found.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Please select a file to verify.' });
  }

  const currentHash = crypto
    .createHash('sha256')
    .update(req.file.buffer)
    .digest('hex');

  const matches = currentHash === record.sha256;
  const timestamp = new Date().toISOString();

  auditLog.unshift({
    evidenceId: record.id,
    action: matches ? 'INTEGRITY_VERIFIED' : 'TAMPER_DETECTED',
    timestamp,
    details: matches
      ? 'Uploaded file matches the registered SHA-256 fingerprint.'
      : 'SHA-256 fingerprint mismatch detected.'
  });

  res.json({
    evidenceId: record.id,
    originalHash: record.sha256,
    currentHash,
    integrity: matches ? 'MATCH' : 'MISMATCH',
    message: matches
      ? 'Integrity verified: file matches the registered fingerprint.'
      : 'WARNING: Hash mismatch. The file differs from the registered evidence.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EvidenceChain API running at http://localhost:${PORT}`);
});
