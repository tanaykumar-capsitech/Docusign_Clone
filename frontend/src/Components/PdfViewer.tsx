import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf"
import SignatureField from "./SignatureField";
import type { PdfViewerProps } from "../Utils/AllInterfaces";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


const PdfViewer = ({ signed, url, setSignatureFields }: PdfViewerProps) => {
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                    <div key={index + 1} className="relative" >
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                        />
                        {!signed &&
                            (
                                <SignatureField
                                    onPlace={(x, y) => {
                                        console.log((index + 1) + " " + x + " " + y)
                                        const page = index + 1

                                        setSignatureFields((prev) => {
                                            const exist = prev?.find(pageno => pageno.page == page)

                                            if (exist) {
                                                return prev?.map((field) => field.page == page ? {
                                                    ...field,
                                                    x: Math.round(x),
                                                    y: Math.round(y)
                                                } : field)
                                            }

                                            return [
                                                ...prev,
                                                {
                                                    page: page,
                                                    x: Math.round(x),
                                                    y: Math.round(y),
                                                    height: 70,
                                                    width: 70
                                                }
                                            ]
                                        })
                                    }}
                                />
                            )}

                    </div>
                ))}
            </Document>
        </>
    )
}

export default PdfViewer