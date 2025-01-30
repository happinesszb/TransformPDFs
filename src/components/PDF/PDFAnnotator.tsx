'use client';

import React from 'react';
import './pdf.component.css';
import Image from 'next/image';
import { useLocale } from '@/hooks/useLocale';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
import { registerLicense } from '@syncfusion/ej2-base';

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex justify-center items-center h-[640px] bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function PDFAnnotator() {
  const { t } = useLocale();
  const resourceUrl = "https://transformpdfs.com/js/ej2-pdfviewer-lib";
  const documentPath = "https://transformpdfs.com/js/ej2-pdfviewer-lib/show.pdf";
  //You should get the license key from https://www.syncfusion.com
  registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY || '');
  return (
    <div className="relative">
      <LoadingSpinner />
      <div className="pdf-container">
        <div className="feature-guides">
          <div className="guide-item">
            <div className="guide-content">
              <Image 
                src="/images/pdf/open-pdf.png" 
                alt="Open PDF" 
                width={31} 
                height={27} 
              />
              <span>{t.tools.annotator.openFile}</span>
            </div>
            <div className="arrow-down">&#8595;</div>
          </div>
          
          <div className="guide-item">
            <div className="guide-content">
              <Image 
                src="/images/pdf/edit.png" 
                alt="Edit PDF" 
                width={30} 
                height={28} 
              />
              <span>{t.tools.annotator.edit}</span>
            </div>
            <div className="arrow-down">&#8595;</div>
          </div>

        <div className="guide-item">
          <div className="guide-content">
            <Image 
              src="/images/pdf/download.png" 
              alt="Save PDF" 
              width={28} 
              height={30} 
            />
            <span>{t.tools.annotator.save}</span>
          </div>
          <div className="arrow-down">&#8595;</div>
        </div>
      </div>

        <div className='control-section'>
          <PdfViewerComponent 
            id="container" 
            documentPath={documentPath}
            resourceUrl={resourceUrl}
            enableAnnotation={true}
            enableAnnotationToolbar={true}
            toolbarSettings={{
              showTooltip: true,
              toolbarItems: [
                "OpenOption",
                "UndoRedoTool",
                "PageNavigationTool",
                "MagnificationTool",
                "PanTool",
                "SelectionTool",
                "CommentTool",
                "SubmitForm",
                "AnnotationEditTool",
                "FormDesignerEditTool",
                "SearchOption",
                "PrintOption",
                "DownloadOption"
              ],
              annotationToolbarItems: [
                "ColorEditTool",
                "OpacityEditTool",
                "AnnotationDeleteTool",
                "StampAnnotationTool",
                "HandWrittenSignatureTool",
                "InkAnnotationTool",
                "ShapeTool",
                "CalibrateTool",
                "StrokeColorEditTool",
                "ThicknessEditTool",
                "FreeTextAnnotationTool",
                "FontFamilyAnnotationTool",
                "FontSizeAnnotationTool",
                "FontStylesAnnotationTool",
                "FontAlignAnnotationTool",
                "FontColorAnnotationTool",
                "CommentPanelTool"
              ],
              formDesignerToolbarItems: [
                "TextboxTool",
                "PasswordTool",
                "CheckBoxTool",
                "RadioButtonTool",
                "DropdownTool",
                "ListboxTool",
                "DrawSignatureTool",
                "DeleteTool"
              ]
            }}
            style={{ 'height': '640px' }}>
            <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, 
                              BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, 
                              FormFields, FormDesigner]} />
          </PdfViewerComponent>
        </div>
      </div>
    </div>
  );
}
