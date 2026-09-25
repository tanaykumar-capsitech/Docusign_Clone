import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Document, Page, pdfjs } from "react-pdf";
import donImg from "../Picture/pngtree-checkmark-symbol-web-design-vector-validation-vote-done-vector-png-image_47906880.jpg"

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import type { Enquiries } from "../Utils/AllInterfaces";
import { DefaultButton, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const url = import.meta.env.VITE_BASE_URL

const SignPage = () => {
    const { id } = useParams()

    const [enquiry, setEnquiry] = useState<Enquiries | null>(null)
    const [pages, setPages] = useState(0)
    const [selectedField, setSelectedField] = useState<number | null>(null)
    const [signedValue, setSignedValue] = useState<string>("")
    const [confirm, setConfirm] = useState<boolean>(false)
    const [spin, setSpin] = useState(false)
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        GetEnquiryDetails()
    }, [])

    const GetEnquiryDetails = async () => {
        const res = await axios.get(url + `ServiceEntries/GetService?serviceId=${id}`)

        if (res.data)
            setEnquiry(res.data)
    }

    const UpdateSign = async () => {
        setSpin(true)
        console.log(id + signedValue)
        await axios.post(url + `ServiceEntries/UpdateSign`,
            {
                "serviceId": id,
                "signature": signedValue
            }
        )
        setSpin(false)
        setUpdated(true)
    }

    if (updated) {
        return (
            <>
                <div className="text-center w-full">
                    <img src={donImg} className="h-[650px] w-[650px] m-auto"></img>
                    <span className="text-[36px] font-bold text-[#23C19E]">You have signed successfully, you may close the tab</span>
                </div>
            </>
        )
    }

    return (
        <div className="h-[100vh] flex flex-col justify-evenly items-center  bg-gray-100">
            <div className="text-center p-4 text-[24px] font-bold">
                Sign in all the required section
            </div>
            <div className="w-fit flex flex-col gap-2">
                <div className="w-full flex gap-2">
                    <DefaultButton text="Cancel" onClick={() => { setSignedValue(""); setConfirm(false) }} />
                    <PrimaryButton text="Confirm" disabled={signedValue == ""} onClick={() => { setConfirm(true) }} />
                    <PrimaryButton text="Update" disabled={!confirm} onClick={() => { UpdateSign() }} >{spin && <Spinner size={SpinnerSize.medium} />}</PrimaryButton>
                </div>
                <div className="border border-gray-300 shadow-xl m-auto max-h-[85vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl">
                    {enquiry &&
                        <Document file={enquiry?.originalFileKey} onLoadSuccess={({ numPages }) => { setPages(numPages) }}>
                            {Array.from(new Array(pages), (_, index) => (
                                <div className="relative">
                                    <Page pageNumber={index + 1}></Page>
                                    {enquiry.signatureField?.find(en => en.page == (index + 1))
                                        ?
                                        (
                                            <input
                                                value={signedValue}
                                                onChange={(e) => { setSignedValue(e.target.value) }}
                                                placeholder="Sign Here"
                                                onClick={() => { setSelectedField(index + 1) }}
                                                style={{
                                                    fontFamily: "'Caveat', cursive",
                                                    position: 'absolute',
                                                    top: enquiry.signatureField.find(en => en.page == (index + 1))!.y,
                                                    left: enquiry.signatureField.find(en => en.page == (index + 1))!.x,
                                                    minWidth: 70,
                                                    height: 70,
                                                    border: selectedField == index + 1 ? '1px solid #b3d9ff' : '',
                                                    borderRadius: 15,
                                                    outline: 'none',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        )
                                        :
                                        null
                                    }
                                </div>
                            ))}
                        </Document>
                    }
                </div>
            </div>
        </div>
    )
}

export default SignPage