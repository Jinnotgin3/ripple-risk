# RippleRisk — Systemic Risk Simulation & Financial Contagion Engine

RippleRisk is a fintech systemic risk analysis and financial contagion simulation platform. It models interconnected financial institutions (Lenders, Borrowers, NBFCs) and simulates shock propagations (Credit Default, Liquidity Freeze, Asset Fire Sale) across complex counterparty exposure networks.

---

## Architecture Overview

The repository is structured into decoupled **frontend** and **backend** applications:

```text
ripple-risk-main/
├── backend/                  # Spring Boot 3.3.5 REST API (Java 17+)
│   ├── pom.xml               # Maven dependencies (JPA, Security, H2, Validation, Lombok)
│   └── src/
│       ├── main/
│       │   ├── java/com/ripplerisk/
│       │   │   ├── config/       # Spring Security & CORS configuration
│       │   │   ├── controller/   # REST Controllers (Auth, Entities, Exposures)
│       │   │   ├── entity/       # JPA Entities (RiskEntity, Exposure)
│       │   │   ├── repository/   # Spring Data JPA Repositories
│       │   │   └── RippleRiskApplication.java
│       │   └── resources/
│       │       └── application.properties # H2 Database and Server Config
│       └── test/
└── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS v4
    ├── package.json
    ├── vite.config.ts        # Vite configuration with /api reverse proxy to :8080
    ├── tsconfig.json
    └── src/
        ├── styles/globals.css # Design system tokens & dark/light theme (design.md)
        ├── lib/
        │   ├── api.ts        # Fetch client with JWT authorization header
        │   └── format.ts     # Currency (INR) and metric formatters
        ├── components/
        │   ├── ui/           # StatusBadge, ArrowButton, etc.
        │   ├── motion/       # Motion & Reveal micro-animations
        │   └── background/   # Scroll-driven SVG risk graph background
        └── pages/
            ├── Login.tsx     # JWT authentication screen
            ├── Networks.tsx  # Counterparty & exposure network builder
            ├── Scenarios.tsx # Shock parameters & contagion scenario configuration
            ├── Results.tsx   # Cascade timeline, contagion metrics & network graph
            ├── Compare.tsx   # Baseline vs Policy intervention comparative view
            ├── Report.tsx    # Tabbed executive risk dossier & report exporter
            └── Audit.tsx     # Immutable system audit trail & log table
```

---

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 17+
- **Persistence**: Spring Data JPA with H2 in-memory database
- **Security**: Spring Security with stateless JWT bearer token authentication and CORS filtering
- **Utilities**: Lombok, Jakarta Validation

### Frontend
- **Framework**: React 19 & TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 (inline `@theme` design tokens from `design.md`)
- **Icons**: Lucide React
- **Animations**: CSS transitions & Framer Motion / Motion primitives with `prefers-reduced-motion` compliance

---

## Design System Compliance (`design.md`)

- **Palette**: Primary Fintech Navy (`#0c4186` / Dark: `#a8c7fa`), categorical chart accents (Blue, Green, Yellow, Coral, Violet).
- **Typography**: Google Sans / Roboto / Inter stack, monospace for financial figures.
- **Currency**: Indian Rupee (`₹`) formatted with standard Indian grouping (`formatINR(val)`).
- **Theme**: Seamless Light and Dark mode switching via CSS custom properties.

---

## Prerequisites

Before running the application, make sure the following are installed:

1. **Java Development Kit (JDK)**: Version 17 or higher (`java -version`)
2. **Apache Maven**: Version 3.8 or higher (`mvn -version`)
3. **Node.js**: Version 18.0 or higher (`node -v`)
4. **npm**: Version 9.0 or higher (`npm -v`)

---

## Getting Started & How to Run

### 1. Run the Backend (Spring Boot)

Open a terminal and navigate to the `backend` folder:

```bash
cd ripple-risk-main/backend
```

Build and run the application using Maven:

```bash
mvn clean spring-boot:run
```

Once started:
- **Backend API Base URL**: `http://localhost:8080`
- **H2 Database Console**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:rippledb`
  - **Username**: `sa`
  - **Password**: *(leave blank)*

---

### 2. Run the Frontend (Vite + React)

Open a second terminal and navigate to the `frontend` folder:

```bash
cd ripple-risk-main/frontend
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

> **Note on API Proxying**: The Vite dev server is preconfigured with a proxy rule in `vite.config.ts`. Any requests to `/api/*` are automatically forwarded to `http://localhost:8080`.

---

## Available Pages & Features

| Route | Page | Purpose |
|---|---|---|
| `/login` | **Login** | Authenticates users and stores JWT session token |
| `/networks` | **Network Builder** | Manage institutions (Lenders/Borrowers) and exposure matrices |
| `/scenarios` | **Scenario Engine** | Define shock types (Credit default, Liquidity freeze), haircut ratios, and cascade rounds |
| `/results` | **Cascade Results** | View round-by-round contagion impact, failed nodes, and capital loss in INR |
| `/compare` | **Comparison** | Compare baseline contagion losses against regulatory/capital interventions |
| `/report` | **Executive Report** | Dossier breakdown with printable / downloadable risk summary |
| `/audit` | **Audit Trail** | Immutable log tracking simulation executions, network edits, and risk thresholds |

---

## REST API Reference

### Authentication
- `POST /api/auth/login` — Exchange credentials (`username`, `password`) for JWT bearer token.

### Entities
- `GET /api/entities` — Retrieve all registered financial institutions.
- `POST /api/entities` — Create a new financial entity (`name`, `type`, `balance`, `status`).
- `DELETE /api/entities/{id}` — Delete an entity by ID.

### Counterparty Exposures
- `GET /api/exposures` — Retrieve all exposure relations.
- `POST /api/exposures` — Add a new directed exposure between lender and borrower.
- `DELETE /api/exposures/{id}` — Remove an exposure by ID.

---

## Production Build

### Frontend
```bash
cd ripple-risk-main/frontend
npm run build
```
Generates production-ready, minified HTML/CSS/JS in `frontend/dist/`.

### Backend
```bash
cd ripple-risk-main/backend
mvn clean package -DskipTests
```
Generates an executable JAR in `backend/target/ripple-risk-0.0.1-SNAPSHOT.jar`. Run with:
```bash
java -jar target/ripple-risk-0.0.1-SNAPSHOT.jar
```
