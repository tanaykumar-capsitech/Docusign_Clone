import { DefaultButton, DetailsList, Icon, Label, Panel, PanelType, type IColumn } from "@fluentui/react"
import axios from "axios"
import { useFormik } from "formik";
import { useEffect, useState } from "react"
import * as Yup from 'yup'
import PdfViewer from "../Components/PdfViewer";

const url = import.meta.env.VITE_BASE_URL

interface SignatureField {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Enquiries {
    id: string;
    serviceName: string;
    originalFileKey: string;
    signedFileKey: string | null;
    recipientEmail: string | null;
    status: number;
    createdBy: string;
    signatureField: SignatureField | null;
    createdAt: string;
}

interface ServiceCreationRequest {
    serviceName: string;
    file: File | null
}

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState<Enquiries[]>([])
    const [openDetails, setOpenDetails] = useState(false)
    const [openAddForm, setOpenAddForm] = useState(false)
    const [enquiry, setEnquiry] = useState<Enquiries>()


    const GetEnquiries = async () => {
        const result = await axios.get(url + "ServiceEntries/GetAllServices")
        setEnquiries(result.data)
    }

    const AddNewEnquiries = async (values: ServiceCreationRequest) => {
        const formData = new FormData()

        formData.append("serviceName", values.serviceName)
        if (values.file)
            formData.append("document", values.file)

        const result = await axios.post(url + "ServiceEntries/CreateService", formData)
        console.log(result);
        setOpenAddForm(false)
        GetEnquiries()
    }

    useEffect(() => {
        GetEnquiries()
    }, [])

    const columns: IColumn[] = [
        {
            key: 'serviceName',
            name: 'Service Name',
            fieldName: 'serviceName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: Enquiries) => {
                return <span>{item.serviceName}</span>;
            },
            isPadded: true,
        },
        {
            key: 'createdAt',
            name: 'Created At',
            fieldName: 'createdAt',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: Enquiries) => {
                return <span>{item.createdAt.split('T')[0]}</span>;
            },
            isPadded: true,
        },
        {
            key: 'createdBy',
            name: 'Created By',
            fieldName: 'createdBy',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: Enquiries) => {
                return <span>{item.createdBy}</span>;
            },
            isPadded: true,
        },
        {
            key: 'status',
            name: 'Status',
            fieldName: 'status',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: Enquiries) => {
                return <span>{item.status == 0 ? 'Drafted' : item.status == 1 ? 'Sent' : item.status == 2 ? 'Signed' : 'Approved'}</span>;
            },
            isPadded: true,
        },
        {
            key: 'originalFileKey',
            name: 'Url',
            fieldName: 'originalFileKey',
            minWidth: 200,
            maxWidth: 300,
            isResizable: true,
            onRender: (item: Enquiries) => {
                return <span>{item.originalFileKey}</span>;
            },
            isPadded: true,
        },
        {
            key: 'id',
            name: 'Actions',
            fieldName: 'id',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: Enquiries) => {
                return <span onClick={() => { setEnquiry(item); setOpenDetails(true) }}>
                    <Icon iconName="RedEye" className="p-1 bg-gray-200 rounded-2xl cursor-pointer" styles={{ root: { fontWeight: 600 } }}></Icon>
                </span>;
            },
            isPadded: true,
        },

    ]

    const initial: ServiceCreationRequest = {
        serviceName: '',
        file: null
    }
    const validationSchema = Yup.object({
        serviceName: Yup.string().required("Please enter name"),
        file: Yup.mixed<File>()
            .required("Please attach pdf file")
            .test("fileType", "Please upload pdf", (file) => file?.type == "application/pdf")
            .test("fileSize", "File size should under 25mb", (file) => file?.size <= 25 * 1024 * 1024)
    })
    const formik = useFormik<ServiceCreationRequest>({
        initialValues: initial,
        validationSchema,
        onSubmit: (value) => { AddNewEnquiries(value) }
    })

    return (
        <div className="py-10 px-5">
            <DefaultButton text="Add New" onClick={() => setOpenAddForm(true)}></DefaultButton>
            <DetailsList items={enquiries} columns={columns} className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"></DetailsList>

            <Panel isOpen={openAddForm} onDismiss={() => { setOpenAddForm(false) }}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-5">
                        <Label>Service Name:</Label>
                        <input name="serviceName" className="px-2 outline-none w-full border border-gray-300 rounded" type="text" onChange={formik.handleChange} value={formik.values.serviceName}></input>
                        <div className="text-red-600">{formik.errors.serviceName ?? ""}</div>
                    </div>
                    <div className="mb-5">
                        <Label>Upload File:</Label>
                        <input
                            className="px-2 outline-none w-full border border-gray-300 rounded"
                            name="file"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                                const file = e.currentTarget.files?.[0]
                                formik.setFieldValue("file", file)
                            }}

                        >
                        </input>
                        <div className="text-red-600">{formik.errors.file ?? ""}</div>
                    </div>
                    <button type="submit" className="px-2 border border-gray-300 rounded">Register</button>
                </form>
            </Panel>

            <Panel type={PanelType.medium} isOpen={openDetails} onClick={() => setOpenDetails(false)}>
                {enquiry &&
                    <PdfViewer url={enquiry.originalFileKey} />
                }
            </Panel>

        </div>
    )
}

export default EnquiryList