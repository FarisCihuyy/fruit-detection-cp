# Fresh Fruit

Fresh Fruit is an intelligent web application designed to help users identify various types of fruits using Machine Learning, while also providing a platform to write and publish articles related to fruits and healthy living.

## Features

- **Fruit Prediction**: Upload or capture an image of a fruit, and the application will predict its type using an integrated TensorFlow.js (`@tensorflow/tfjs`) machine learning model.
- **Article Creation**: A built-in content management feature that allows users to create, read, and manage articles.

## Tech Stack

- **Package Manager**: pnpm
- **Frontend**: React / Next.js (TSX)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v16.x or higher recommended)
- pnpm (v8.x or higher)

## Setup & Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repository-url>
   cd fresh-fruit
   ```

2. **Install dependencies**:
   Since this project uses `pnpm`, run the following command to install all required packages:

   ```bash
   pnpm install
   ```

3. **Environment Variables**:
   This project uses `dotenv` to manage environment configurations.
   Create a `.env` file in the root directory and configure your variables. You can copy the example file if available:
   ```bash
   cp .env.example .env
   ```

## Running the Project

### Development Server

To start the local development server, run:

```bash
pnpm run dev
```

Open http://localhost:3000 with your browser to see the result.
