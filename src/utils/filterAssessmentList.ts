import { InvoiceType } from "../types/invoice.type";

export const filterAssessmentList = (data: InvoiceType[]) => {
    const filteredList = data.filter(item=> item.billingStatus === "BILLED")
    return filteredList
}