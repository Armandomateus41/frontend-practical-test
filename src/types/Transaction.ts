export interface Transaction {
    id: number;
    accountID: string;
    transactionAmount: number;
    transactionCurrencyCode: string;
    localHour: string;
    transactionScenario: string;
    transactionType: string;
    transactionIPaddress: string;
    ipState: string;
    ipPostalCode: string;
    ipCountry: string;
    isProxyIP: boolean;
    browserLanguage: string;
    paymentInstrumentType: string;
    cardType: string;
    paymentBillingPostalCode: string;
    paymentBillingState: string;
    paymentBillingCountryCode: string;
    shippingPostalCode: string;
    shippingState: string;
    shippingCountry: string;
    cvvVerifyResult: string;
    digitalItemCount: number;
    physicalItemCount: number;
    transactionDateTime: string;
  }
  