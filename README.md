# Newnop Issue Tracker

A modern, high-performance issue tracker built with React, TypeScript, and Vite.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Docker Setup](#docker-setup)

## Features

- **Blazing Fast**: Powered by Vite.
- **Type Safe**: Developed with TypeScript.
- **Responsive Design**: Mobile-first approach with premium aesthetics.
- **Containerized**: Docker-ready for development and production.

## Project Structure

```text
src/
├── config/     # Configuration files and constants
├── hooks/      # Custom React hooks
├── pages/      # Page components
├── template/    # Reusable UI templates/layouts
├── utils/      # Utility functions
├── App.tsx     # Main application component
└── main.tsx    # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the root directory and add necessary variables. See `.env.example` (if provided) for reference.

## Docker Setup

### Building the Image

```bash
docker build -t newnop-issue-tracker .
```

### Running the Container

```bash
docker run -p 5173:5173 newnop-issue-tracker
```
