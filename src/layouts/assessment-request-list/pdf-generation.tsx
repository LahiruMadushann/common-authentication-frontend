import { useGenerateInvoiceBillQuery } from '@/src/app/services/invoice';
import InvoicePdf from './invoice-pdf';
import DebitTransferPdf from './debit-transfer-pdf';
import PDFInvoiceLoading from '@/src/components/loading-screens/pdf-invoice-loading';
import { handleErrors } from '@/src/utils/handleErrors';

type PdfGenerationPropsType = {
  year: string;
  month: string;
  shopId: string;
};

function PdfGeneration(props: PdfGenerationPropsType) {
  const { data, isLoading, isError, error } = useGenerateInvoiceBillQuery({
    year: props.year,
    month: props.month,
    shopId: props.shopId
  });

  if (isLoading) {
    return <PDFInvoiceLoading/>;
  }

  if(isError){
    handleErrors(error)
  }

  return (
    <div>
      {data && data.billingDataInvoiceDto && data.billingDataInvoiceDto?.paymentType === 'BILLING' && <InvoicePdf data={data} />}
      {data && data.billingDataInvoiceDto && data.billingDataInvoiceDto?.paymentType !== 'BILLING' && (
        <DebitTransferPdf data={data} />
      )}
      {data && !data.billingDataInvoiceDto && <p>PDFは生成されませんでした</p> }
    </div>
  );
}

export default PdfGeneration;
