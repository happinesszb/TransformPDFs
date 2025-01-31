# Online PDF Tools
You can visit [TransformPDFs](https://transformpdfs.com/) to use the online PDF tools.

# Project Setup and Configuration

This project is built using Next.js. To get started, you need to install the dependencies, build the project, and then start the server. Below are the detailed steps and configurations required.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js and Yarn installed on your machine.
- Access to the following services to obtain API keys:
  - Aspose
  - iLovePDF
  - Syncfusion

# Environment Variables Configuration

To run this project, you need to set up the following environment variables in `.env.local`:

## Aspose Keys
- Register at [Aspose](https://www.aspose.com/) to get:
  - `ASPOSE_CLIENT_ID=`
  - `ASPOSE_CLIENT_SECRET=`


## ilovepdf Keys
- Register at [iloveapi](https://iloveapi.com/) to get:
  - `ILOVEPDF_PUBLIC_KEY=`
  - `ILOVEPDF_SECRET_KEY=`

## Syncfusion License Key
- Purchase a license from [Syncfusion](https://www.syncfusion.com/) for PDF annotation and signature features:
  - `NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY=`

## Build and Run
1. Install dependencies:
   ```bash
   yarn install
   ```
2. Build the project:
   ```bash 
   yarn build
   ```
3. Start the development server:
   ```bash
   yarn start
   ```
4. Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

# License
This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.