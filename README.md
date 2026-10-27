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
