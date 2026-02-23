interface MessageRequest {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    timeStamp: Date;
    isResponded: boolean;
    isNotified: boolean;
    isFirstTime: boolean;
    receiverName: string;
  }

  interface MessageRequestType {
    senderId: number;
    receiverId: number;
    content: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
  }

  export type { MessageRequest,MessageRequestType };
