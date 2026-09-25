import { DefaultButton, DetailsList, Icon, Label, Panel, PanelType, PrimaryButton, type IColumn } from "@fluentui/react"
import axios from "axios"
import { useFormik } from "formik";
import { useEffect, useState } from "react"
import * as Yup from 'yup'
import PdfViewer from "../Components/PdfViewer";
import type { Enquiries, ServiceCreationRequest, SignFieldDetails } from "../Utils/AllInterfaces";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BASE_URL

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState<Enquiries[]>([])
    const [openDetails, setOpenDetails] = useState(false)
    const [openAddForm, setOpenAddForm] = useState(false)
    const [enquiry, setEnquiry] = useState<Enquiries>()
    const [signFields, setSignFields] = useState<SignFieldDetails[]>([])
    const [email, setEmail] = useState("")

    const navigate = useNavigate()

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
        formik.resetForm()
    }

    const UpdateSignatureFields = async () => {
        console.log(email)
        await axios.post(url + `ServiceEntries/UpdateSignDetails?serviceId=${enquiry?.id}&&toEmail=${email}`, signFields)
        GetEnquiries()
        setSignFields([])
        setOpenDetails(false)
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
                return <span >
                    <Icon onClick={() => { setEnquiry(item); setOpenDetails(true) }} iconName="RedEye" className="mx-1 p-1 bg-gray-200 rounded-2xl cursor-pointer" styles={{ root: { fontWeight: 600 } }}></Icon>
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

            <Panel
                type={PanelType.medium}
                isOpen={openDetails}
                onDismiss={() => setOpenDetails(false)}
            >

                {enquiry &&
                    <div className="h-full">
                        {enquiry.status != 2 && (
                            <div className="p-4 flex gap-5 fixed w-full bg-white z-10">
                                <div>
                                    <label className="text-[18px]">To: </label>
                                    <input
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        disabled={enquiry.status == 2}
                                        type="text" className="mr-10 py-1 px-3 border border-gray-400 rounded-full outline-none"
                                    />
                                </div>
                                <PrimaryButton disabled={enquiry.status == 2} text="Send" onClick={() => { UpdateSignatureFields() }} />
                                <DefaultButton text="Cancel" onClick={() => { setOpenDetails(false) }} />
                            </div>
                        )}

                        <PdfViewer
                            signed={enquiry.status == 2}
                            url={enquiry.status == 2 ? enquiry.signedFileKey : enquiry.originalFileKey}
                            setSignatureFields={setSignFields}
                        />
                    </div>
                }
            </Panel>

        </div>
    )
}

export default EnquiryList