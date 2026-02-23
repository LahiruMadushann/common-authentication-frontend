export interface AssessedModel {

    id: {
        appraisalid: number;
        shopid: number;
      };
      emailSentTime: string;
      draftEmailSentTime: string;
      isRejectedByShop: boolean;
      assessedEx: string | null; 
      updatedAt: string;
      status: string;
      evidenceImage: string | null; 
      reasonForRejection: string | null; 
      applicationDate: string;
      approvalDate: string | null;
      dismissalDate: string | null;
      buyerReject: boolean | null;

  }