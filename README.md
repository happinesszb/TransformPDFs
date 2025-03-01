
# Online PDF Tools
You can visit [TransformPDFs](https://transformpdfs.com/) to use the online PDF too and access 38+ PDF tools instantly. 

# Optimize PDF

- **Compress PDF**: Reduce the file size of your PDF documents without compromising quality.
- **PDF OCR**: Optical Character Recognition to extract text from scanned documents or images.

## Convert from PDF

- **PDF to Word**: Convert PDF files into editable Microsoft Word documents.
- **PDF to Excel**: Transform PDFs into Microsoft Excel spreadsheets.
- **PDF to PPT**: Convert PDF files into PowerPoint presentations.
- **PDF to JPG**: Export PDF pages as high-quality JPEG images.
- **PDF to HTML**: Convert PDF documents into HTML format for web use.
- **PDF to EPUB**: Create e-books by converting PDFs to EPUB format.
- **PDF to TIFF**: Save PDF pages as TIFF images.
- **PDF to TEX**: Convert PDFs into TEX files for LaTeX users.
- **PDF to SVG**: Export PDFs as scalable vector graphics.
- **PDF to XML**: Transform PDFs into XML files.
- **PDF to MOBI**: Convert PDFs into MOBI format for e-readers.
- **PDF to XPS**: Save PDFs as XPS documents.
- **PDF OCR**: Extract text from scanned PDFs using OCR technology.

## Convert to PDF

- **Word to PDF**: Convert Word documents into PDF format.
- **PPT to PDF**: Convert PowerPoint presentations into PDFs.
- **Excel to PDF**: Convert Excel spreadsheets into PDF files.
- **JPG to PDF**: Combine JPEG images into a single PDF document.
- **EPUB to PDF**: Convert EPUB e-books into PDF format.
- **HTML to PDF**: Save web pages as PDF documents.
- **Tex to PDF**: Convert TEX files into PDF format.
- **PS to PDF**: Convert PostScript files into PDFs.
- **XSLFO to PDF**: Convert XSLFO files into PDFs.
- **PCL to PDF**: Convert PCL files into PDF format.
- **SVG to PDF**: Save SVG images as PDF documents.
- **XML to PDF**: Convert XML files into PDFs.
- **Markdown to PDF**: Convert Markdown files into PDF format.

## Organize

- **Merge PDF**: Combine multiple PDF files into one.
- **Split PDF**: Divide a single PDF into multiple files.
- **Delete Pages**: Remove specific pages from a PDF.
- **Extract Pages**: Extract pages from a PDF to create a new document.
- **Rotate PDF**: Adjust the orientation of PDF pages.

## Edit

- **Annotate PDF**: Add comments, highlights, and notes to PDF files.
- **Sign PDF**: Sign your PDF documents.
- **Page Numbers**: Add page numbers to your PDF files.
- **Watermark**: Insert watermarks into PDF documents for branding or copyright protection.

## Encrypt

- **Encrypt PDF**: Secure your PDF files with password protection.
- **Unlock PDF**: Remove password protection from PDFs.

# TransformPDFs compared to the industry's most powerful software
<table> <thead> <tr> <th>Compare features</th> <th>TransformPDFs</th> <th>Adobe Acrobat</th> <th>SmallPDF</th> </tr> </thead> <tbody> <tr> <td>Supports 16+ file formats</td> <td>✓</td> <td>-</td> <td>-</td> </tr> <tr> <td>Open Source</td> <td>✓</td> <td>-</td> <td>-</td> </tr> <tr> <td>Don't store files</td> <td>✓</td> <td>-</td> <td>-</td> </tr> <tr> <td>Local Deployment</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Free to use</td> <td>✓</td> <td>-</td> <td>-</td> </tr> <tr> <td>Compress PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>PDF OCR</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>PDF to Office</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>PDF to Image</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Office to PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Image to PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Merge PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Split PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Extract Pages</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Delete Pages</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Rotate PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Protect PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Sign PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Annotate PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Watermark PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> <tr> <td>Add page number to PDF</td> <td>✓</td> <td>✓</td> <td>✓</td> </tr> </tbody> </table>

# Project Setup and Configuration

This project is built using Next.js. To get started, you need to install the dependencies, build the project, and then start the server. Below are the detailed steps and configurations required.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js and Yarn installed on your machine.
- Access to the following services to obtain API keys:
  - Aspose
  - iLoveapi
  - Syncfusion

# Environment Variables Configuration

To run this project, you need to set up the following environment variables in `.env.local`:

## Aspose Keys
- Register at [Aspose](https://www.aspose.com/) to get:
  - `ASPOSE_CLIENT_ID=`
  - `ASPOSE_CLIENT_SECRET=`


## iloveapi Keys
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