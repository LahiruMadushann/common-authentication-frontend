import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PDFInvoiceLoading() {
  return (
    <div className="notranslate w-full max-h-[80vh] overflow-auto">
      <div className="pdf-container">
        <div
          className="pdf-content max-w-full"
          style={{ 
            padding: '20px', 
            fontSize: 'small', 
            backgroundColor: '#ffffff',
            transform: 'scale(0.9)',
            transformOrigin: 'top center'
          }}>
          <div className="header-invoice-section flex flex-col md:flex-row justify-between gap-4">
            <div className="sub-invoice-section-1 w-full md:w-1/2">
              <p><Skeleton height={20} /></p>
              <p><Skeleton height={20} /></p>
              <p><Skeleton height={20} /></p>
              <p><Skeleton height={20} /></p>
              <p><Skeleton height={20} /></p>
            </div>
            <div className="sub-invoice-section-2 w-full md:w-1/2">
              <p><Skeleton height={20} /></p>
              <p><Skeleton height={20} /></p>
              <p><Skeleton height={20} /></p>

              <div className="sub-invoice-section-2-details mt-4">
                <p><Skeleton height={20} width={150} /></p>
                <p><Skeleton height={20} /></p>
                <p><Skeleton height={20} /></p>
                <p><Skeleton height={20} /></p>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p><Skeleton height={20} /></p>
            <p><Skeleton height={20} /></p>
          </div>
          <div className="invoice-container-table flex flex-col md:flex-row gap-4">
            <div className="total-amount-table w-full md:w-1/2">
              <table className="invoice-table w-full mb-4">
                <thead>
                  <tr>
                    <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="transfer-table w-full md:w-1/2">
              <table className="invoice-table w-full mb-4">
                <thead>
                  <tr>
                    <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                    <th className="invoice-table-body border p-1"><Skeleton height={20} /></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="invoice-table-header border p-1"><Skeleton height={20} /></td>
                    <td className="invoice-table-body border p-1">
                      <p><Skeleton height={20} /></p>
                      <p><Skeleton height={20} /></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="responsive-table-container overflow-x-auto mb-4">
            <table className="invoice-table w-full">
              <thead>
                <tr>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                  <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                  <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                  <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                  <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                  <td className="invoice-table-body border p-1"><Skeleton height={20} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="responsive-table-container overflow-x-auto">
            <table className="invoice-table w-full">
              <thead>
                <tr>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                  <th className="invoice-table-header border p-1"><Skeleton height={20} /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
                <tr>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
                <tr>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="border p-1" colSpan={2}></td>
                  <td className="border p-1" colSpan={1}><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
                <tr>
                  <td className="border p-1" colSpan={2}><Skeleton height={20} /></td>
                  <td className="border p-1" colSpan={1}><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
                <tr>
                  <td className="border p-1" colSpan={2}>
                    <Skeleton height={20} />
                  </td>
                  <td className="border p-1" colSpan={1}><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
                <tr>
                  <td className="border p-1" colSpan={2}></td>
                  <td className="border p-1" colSpan={1}><Skeleton height={20} /></td>
                  <td className="border p-1"><Skeleton height={20} /></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="mr-12 w-24">
          <Skeleton height={36} />
        </div>
      </div>
    </div>
  );
}