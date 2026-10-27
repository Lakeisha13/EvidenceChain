# EvidenceChain – Digital Evidence Collection and Chain-of-Custody System

## Overview
EvidenceChain is a cloud-based application designed to register digital evidence, calculate its SHA-256 hash, store files securely in Amazon S3, and maintain evidence metadata and audit records in Amazon RDS for MySQL.

The system supports integrity verification by comparing the hash of an uploaded file with the hash recorded when the evidence was registered. A mismatch generates a tampering warning.

## Key Features
- Register digital evidence with a case name and evidence description.
- Calculate a SHA-256 hash for integrity checking.
- Store evidence files in Amazon S3.
- Store evidence metadata and audit logs in Amazon RDS for MySQL.
- Verify uploaded files against their registered hashes.
- Record evidence registration, successful verification, and detected hash mismatches.
- Deploy the application on Amazon EC2.

## Cloud Architecture
- **Amazon EC2:** Hosts the Node.js/Express backend and production frontend.
- **Amazon S3:** Stores uploaded evidence files.
- **Amazon RDS for MySQL:** Stores evidence metadata and audit logs.
- **AWS IAM:** Controls access to AWS resources.
- **AWS Systems Manager Parameter Store / CloudWatch:** Supporting AWS management and monitoring services, where configured.

## Technology Stack
- Frontend: React and Vite
- Backend: Node.js and Express
- Database: Amazon RDS for MySQL
- Object storage: Amazon S3
- Integrity verification: SHA-256
- Version control: Git and GitHub

## Integrity Verification
When evidence is registered, the application calculates and records its SHA-256 hash. During verification, the application calculates the hash of the uploaded file and compares it with the stored hash. If the hashes differ, the application reports a possible integrity mismatch.

**Note:** Verification is triggered by uploading a file. The application does not continuously monitor stored evidence for changes.

## Security Considerations
The deployment uses private database access, security groups, IAM permissions, S3 Block Public Access, S3 versioning, and encryption at rest. The current demo is served over HTTP; HTTPS and further security hardening are recommended before production use.

## Repository Structure
- `backend/` – Node.js backend and API
- `frontend/` – React frontend and build configuration
- `.gitignore` – Excludes environment files and dependency folders

## Running Locally
Install Node.js and MySQL, configure the required environment variables in a local backend `.env` file, and install the frontend and backend dependencies using their respective package managers.

Never commit `.env` files, database passwords, AWS credentials, or other secrets to version control.

## Project Purpose
This project demonstrates cloud-based evidence storage, cryptographic integrity verification, database persistence, and audit logging as part of a Cloud Computing project.


## Project: EvidenceChain – Digital Evidence Collection & Chain-of-Custody System

**Architecture and Components**
- **Frontend:** React provides the dashboard for uploading evidence, viewing records, and verifying file integrity.
- **Backend:** Node.js and Express handle API requests, file uploads, hash verification, and audit logging.
- **Amazon EC2:** Hosts and runs the application backend.
- **Amazon S3:** Stores uploaded digital evidence files securely.
- **Amazon RDS (MySQL):** Stores evidence metadata, SHA-256 hashes, and audit records.

**Workflow**
1. A user uploads a digital evidence file and enters its details.
2. The backend generates a SHA-256 hash and stores the file in S3.
3. Evidence metadata and the original hash are saved in RDS.
4. During verification, the system calculates the uploaded file's hash and compares it with the stored hash.
5. Matching hashes indicate that the file passes the integrity check; different hashes indicate possible tampering.
6. The system records evidence registration, verification, and tampering events in its audit trail.

**Technologies:** React, Node.js, Express, MySQL, Amazon EC2, Amazon S3, and Amazon RDS.

**How to run:** Install Node.js and the project dependencies, configure the required environment variables locally, start the backend using `npm start` in the backend directory, and run the frontend using the commands documented in the project README.

**Security note:** API keys, database passwords, and other secrets must never be committed to the public repository.
