export interface Enquiries {
    id: string;
    serviceName: string;
    originalFileKey: string;
    signedFileKey: string | null;
    recipientEmail: string | null;
    recipientSignature: string | null;
    status: number;
    createdBy: string;
    signatureField: SignFieldDetails[] | null;
    createdAt: string;
}

export interface ServiceCreationRequest {
    serviceName: string;
    file: File | null
}

export interface PdfViewerProps {
    signed: boolean
    url: string | null
    setSignatureFields: React.Dispatch<React.SetStateAction<SignFieldDetails[]>>
}

export interface SignFieldDetails {
    page: number,
    x: number,
    y: number,
    height: number,
    width: number
}