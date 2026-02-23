import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LogoImage from '../../assets/logo_ctn.png';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { InvoiceForPDFType } from '@/src/types/invoice.type';
import { generateBill } from '@/src/utils/generateBill';

export default function InvoicePdf(props: { data: InvoiceForPDFType }) {
  const printRef = useRef<HTMLDivElement>(null);
  const generateInvoicePDF = async () => {
    const element = printRef.current;
    if (element) {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        ignoreElements: (el) => el.tagName === 'SCRIPT',
        onclone: (documentClone) => {

          documentClone.querySelectorAll('*').forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.style.color.includes('oklch') || node.style.color === '') {
                node.style.color = '#000'; 
              }
              if (node.style.backgroundColor.includes('oklch') || node.style.backgroundColor === '') {
                node.style.backgroundColor = '#ffffff'; 
              }
             
              const computedStyle = window.getComputedStyle(node);
              if (computedStyle.color.includes('oklch')) {
                node.style.color = '#000';
              }
              
              if (computedStyle.backgroundColor.includes('oklch')) {
                node.style.backgroundColor = '#ffffff';
              }
            }
          });
        },
      });
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF();

      // Get the dimensions of the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Get the original image dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate scaling factor
      const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      // Calculate new dimensions of the image
      const newWidth = imgWidth * scale;
      const newHeight = imgHeight * scale;

      // Center the image on the PDF page
      const x = (pdfWidth - newWidth) / 2;
      const y = (pdfHeight - newHeight) / 3;

      // Add the image to the PDF
      pdf.addImage(data, 'PNG', x, y, newWidth, newHeight);
      pdf.save('invoice.pdf');
    }
  };

  return (
    <div className="notranslate w-full max-h-[80vh] overflow-auto" translate="no">
      <div className="pdf-container">
        <div
          ref={printRef}
          className="pdf-content max-w-full"
          style={{ 
            padding: '20px', 
            fontSize: 'small', 
            backgroundColor: '#ffffff',
            transform: 'scale(0.9)',
            transformOrigin: 'top center'
          }}>
          <div className="header-invoice-section flex flex-col md:flex-row justify-between gap-4">
            <div className="sub-invoice-section-1">
              <p>〒{props.data?.billingDataInvoiceDto?.zipCode} </p>
              <p>{props.data?.billingDataInvoiceDto?.billingPrefecture}{' '}
              {props.data?.billingDataInvoiceDto?.billingMuncipalities}{' '}
              {props.data?.billingDataInvoiceDto?.billingAddress}</p>
              <p>{props.data?.billingDataInvoiceDto?.companyName}</p>
              <p>{props.data?.billingDataInvoiceDto?.billingDepartment}</p>
              <p>{props.data?.billingDataInvoiceDto?.pic}</p>
            </div>
            <div className="sub-invoice-section-2">
              <p style={{ fontSize: 'x-large', fontWeight: 'bold' }}>請 求 書</p>
              <p>作成日：{props.data?.creationDate}</p>
              <p>登録番号：T3120001160456</p>

              <div className="sub-invoice-section-2-details mt-4">
                <img src={LogoImage} className="w-24 md:w-32" />
                <p>株式会社ＣＴＮ</p>
                <p>〒572-0086 大阪府寝屋川市松屋町18-9</p>
                <p>CasaAdvance2F</p>
                <p>TEL:072-800-7106 FAX:072-800-7107</p>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p>平素は格別のご高配を賜り、厚く御礼申し上げます。</p>
            <p>下記の通りご請求申上げます。</p>
          </div>
          <div className="invoice-container-table flex flex-col md:flex-row gap-4">
            <div className="total-amount-table w-full md:w-1/2">
              <table className="invoice-table w-full mb-4">
                <thead>
                  <tr>
                    <th className="invoice-table-header border p-1">合計金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="invoice-table-body border p-1">{props.data?.TotalPlusTax >= 0 ? `¥${props.data?.TotalPlusTax}` : `-¥${Math.abs(props.data?.TotalPlusTax)}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="transfer-table w-full md:w-1/2">
              <table className="invoice-table w-full mb-4">
                <thead>
                  <tr>
                    <th className="invoice-table-header border p-1">振込</th>
                    <th className="invoice-table-body border p-1">{props.data?.deadline}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="invoice-table-header border p-1">振込口座</td>
                    <td className="invoice-table-body border p-1">
                      <p>関西みらい銀行（0159） 堺筋営業部（098）</p>
                      <p>普通預金　　0137897　株式会社CTN（ｼｲﾃｲｴﾇ）</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="responsive-table-container overflow-x-auto">
            <table className="invoice-table w-full mb-4">
              <thead>
                <tr>
                  <th className="invoice-table-header border p-1">合計金額</th>
                  <th className="invoice-table-header border p-1">10％対象</th>
                  <th className="invoice-table-header border p-1">消費税（10％）</th>
                  <th className="invoice-table-header border p-1">8％対象</th>
                  <th className="invoice-table-header border p-1">消費税（8％）</th>
                  <th className="invoice-table-header border p-1">非課税</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="invoice-table-body border p-1">{props.data?.TotalPlusTax >= 0 ? `¥${props.data?.TotalPlusTax}` : `-¥${Math.abs(props.data?.TotalPlusTax)}`}</td>
                  <td className="invoice-table-body border p-1">{props.data?.netTotal >= 0 ? `¥${props.data?.netTotal}` : `-¥${Math.abs(props.data?.netTotal)}`}</td>
                  <td className="invoice-table-body border p-1">¥{props.data?.tenPercentTax > 0 ? props.data?.tenPercentTax : 0}</td>
                  <td className="invoice-table-body border p-1">¥0</td>
                  <td className="invoice-table-body border p-1">¥{props.data?.eightPercentTax > 0 ? props.data?.eightPercentTax : 0}</td>
                  <td className="invoice-table-body border p-1">¥{props.data?.taxExempt > 0 ? props.data?.taxExempt : 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="responsive-table-container overflow-x-auto">
            <table className="invoice-table w-full">
              <thead>
                <tr>
                  <th className="invoice-table-header border p-1">詳細</th>
                  <th className="invoice-table-header border p-1">数量</th>
                  <th className="invoice-table-header border p-1">単価</th>
                  <th className="invoice-table-header border p-1">金額</th>
                </tr>
              </thead>
              <tbody>
                {generateBill(
                  props.data.assessmentEx,
                  props.data.assessmentNonEx,
                  props.data.assessmentIncreasePrefectureNonEx,
                  props.data.rejectionLastMonthEx,
                  props.data.rejectionLastMonthNonEx,
                  props.data.rejectionLastMonthIncreasePrefectureNonEx,
                  props.data.referral,
                  props.data.introduction,
                  props.data.increasePrefectureIntroduction,
                  props.data.nonExAmount,
                  props.data.nonExIncreasePrefectureAmount,
                  props.data.rejectionNonExAmount,
                  props.data.rejectionIncreasePrefectureNonExAmount,
                  props.data.exAmount,
                  props.data.rejectionExAmount,
                  props.data.japaneesMonth,
                ).map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="border p-1">{item.description}</td>
                      <td className="border p-1">{item.volume}</td>
                      <td className="border p-1">¥{item.unitPrice}</td>
                      <td className="border p-1">{item.total}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border p-1" colSpan={2}></td>
                  <td className="border p-1" colSpan={1}>合計（税抜き）</td>
                  <td className="border p-1">{props.data?.netTotal >= 0 ? `¥${props.data?.netTotal}` : `-¥${Math.abs(props.data?.netTotal)}`}</td>
                </tr>
                <tr>
                  <td className="border p-1" colSpan={2}>備考</td>
                  <td className="border p-1" colSpan={1}>消費税（10％）</td>
                  <td className="border p-1">¥{props.data?.tenPercentTax > 0 ? props.data?.tenPercentTax : 0}</td>
                </tr>
                <tr>
                  <td className="border p-1" colSpan={2}>
                    ※お振込手数料は、貴社にてご負担いただきますようお願申し上げます。
                  </td>
                  <td className="border p-1" colSpan={1}>消費税（8％）</td>
                  <td className="border p-1">¥{props.data?.eightPercentTax > 0 ? props.data?.eightPercentTax : 0}</td>
                </tr>
                <tr>
                  <td className="border p-1" colSpan={2}></td>
                  <td className="border p-1" colSpan={1}>非課税</td>
                  <td className="border p-1">¥{props.data?.taxExempt > 0 ? props.data?.taxExempt : 0}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div> 
      </div>
      <DialogFooter className="mt-4">
        <Button className='mr-12' onClick={generateInvoicePDF}>PDFの生成</Button>
      </DialogFooter>
    </div>
  );
}
