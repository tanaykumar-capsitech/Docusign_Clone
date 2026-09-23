import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf"


import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PdfViewer = ({ url }: { url: string }) => {
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                    />
                ))}
            </Document>
        </>
    )
}

export default PdfViewer