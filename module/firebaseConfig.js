const admin = require("firebase-admin");
const { doc, updateDoc } = require("firebase-admin/firestore");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "my-landing-page-c67b9",
    private_key_id: "176db9385824c8e361a487b4f5f5d9df9d4dbc32",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSQk+6hWnfdsct\nZOTUlRQfmuuqpo5uGttGwfWOA7Itlvh1RKN39vsVFDWKTLgMgdRplNrxPJM0UMwp\noyZ7H8pMIHhXsAcea7OtDTN3BUt0MY1CfLMYkLd7cshG5qZZEKkAxOviwVzJwVEI\nujVeqDqLKFc7wRxMGJe0pA2KiQPagL282GHIquYCs68Z3iWzA2CJ5eBX4j191p1E\nJku/4mTXyalOlxEfyg9C94ZzH5C0+KM+TnDTxw1BPPNgaps7l+5c+S/nsVAOzV8T\niVvUdBeLaUT9gYhoKN1kdwYVorhxihDhgyXtXZkfL9p3JbM30IiqPH5mqBVNj6M4\nPBcS4cDfAgMBAAECggEAMRMyKb5W+kXuck1wzZ9oHYJazC9o4hEZqhe+WSHKtjJd\nFn3pS6hVbVOUtY13jc/FxMjuG01ArH7JUFSYuDcwz/jqLclTuAl6XANPRlHxjRK9\nvk19vdeVQ9aEIWxXWkV1tMzBo+Du59ZbtBZGO6w3UeCeD7/ge3BoBE0gLfwR7q8e\nNzAFPmOmh60CBVTflwXdv7ST79hmIFaZ7qzvbbSCwyTEY2m9rQdS+KmssG1KPCZN\nrz6gvOQcVveGsqGpWh2i9vk9oAhMw44/677AmilRU3idk0O+9rXXbzri6PkM3gSx\nUzx78wlWmiwMQA2mvEMZDRIQ+xpPN9a4QhkdxP59gQKBgQD68SthpY8f59d1UG/R\no4LANiWg0B3AfdIDOT4Doa3hw0JFE/KR8Jfr8LhOuloRh+rSr8Hv3mwSNUN2uesk\nziFPrZr7I5Rb5EgbN6/NDQBLD3PnTNMmIhlo5EEzhqjyZG8rsX4ENVNxDmOKKDmE\nub49SwH/xQfB+wizCKmAM/56gQKBgQDWfzjyaCmS69T1hiNLYn8MbmOUUMJwSQQW\nNatv0CZt6kU1hCtceD1PJPLr34g1Fl4stkZHx7GztXo/9IXW2LlAmB5S3opPK3L9\nauv4P/oYiRSRty+hjXvgOnMoNOMh+ML539EQOKIXND38JFkk2H+B4t7qSk96QX/Z\nVgihKU7LXwKBgQCQGObBVrF+L8JwcjUTm6IcP7uRwZAkFdv/z+IFcdUIe/hU9GRp\nW0/Rw1QCmU3ZHURBoX1rATzro7xOs+oMI3XLbDQ/nCm4LrkdL/f6dknB0GjM3Dev\ngQs4SUILlXr0Xanc3DoxrnFwzUNpdTm6NnLAfY7zUS/oOv++1u2GWdT6gQKBgBIz\nX2iqUATIgByJUkteQzuRzl9Sbv1KJM+hpDdrqScgftjoqylAhqtFjltXb15Z1Ink\nuZfzqO9/0azFmem+IBIMFl6fxYqsPCimvvkkrJsSXq1yptcFg2Jmc0kRG8jRK/I5\n/Kpss8xWQYA4sVvABynFT3b/8TiFgEy30SmjsKzvAoGAS8OGwdAZSnkToU+SLTPB\nUsmiP/fkKEj0xb/bq5lsSZCKzn6lioVKKZZOTWaG0scJSZt+YTQHPLETEKbxSoAY\nAu+RPEnEekqFZ460V7vA7BKuxZRgb/UGkymCUlWfARBFkIKoE+5rUwPBw24j1hgM\n+HvgXvq7sWVZhFU6VkvCrrM=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-bejwu@my-landing-page-c67b9.iam.gserviceaccount.com",
    client_id: "111990319529505203772",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-bejwu@my-landing-page-c67b9.iam.gserviceaccount.com",
  }),
  databaseURL: "https://my-landing-page-c67b9.firebaseio.com", // URL бази даних
});

module.exports = {
  admin: admin,
  doc: admin.firestore().doc,
  updateDoc: admin.firestore().updateDoc,
};
